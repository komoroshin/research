# G2 — Автодиагностика ошибок оператора по выгрузке геодезических измерений

Проверяемое утверждение: «Автоматическая диагностика ошибок начинающего оператора по выгрузке
геодезических измерений — что именно он сделал не так и что проверять — не закрыта существующим софтом».

Порог опровержения: если существующие пакеты дают не только **обнаружение** расхождений, но и
**диагностику причины** с **порядком проверки** — критерий опровергнут.

Статус: ГОТОВО. Дата проверки: 2026-09-02.

**ВЕРДИКТ: ЗАКРЫТО ЧАСТИЧНО** — порог опровержения формально не достигнут (никто не даёт
физическую причину + порядок проверки под датасет), но утверждение «диагностики нет» неверно:
КРЕДО ДАТ классифицирует тип ошибки и находит неверный исходный пункт, Leica GeoMoS Adjustment
называет нестабильные реперы. Подробности — в разделе ВЕРДИКТ в конце.

---

## 1. Что уже делает стандартный софт

### Trimble Business Center (TBC)
- **Tau-тест / data snooping есть.** Справка TBC: «A value computed from an internal frequency
  distribution based upon the number of observations, degrees of freedom, and a given probability
  percentage (95%). This value is used to determine if an observation is not fitting with the others
  in the adjustment. If an observation's residual exceeds the tau, it can be considered an outlier.»
  — https://help.fieldsystems.trimble.com/tbc/2531.htm (справка вендора, актуальная версия)
- **Как выдаётся пользователю:** наблюдения, у которых стандартизированный остаток не проходит
  критерий Tau, **подсвечиваются красным** в разделе Observations отчёта об уравнивании.
  — https://help.fieldsystems.trimble.com/tbc/2426.htm
- **Диагностики причины НЕТ.** Страница «Understanding Network Adjustment» формулирует цель
  уравнивания как «Estimate and remove random errors», «Detect blunders and large errors»,
  «Provide a single solution when there is redundant data». Никаких указаний на источник ошибки
  (высота инструмента, призменная постоянная, сбитый репер) на странице нет — только констатация
  наличия и величины.
  — https://help.fieldsystems.trimble.com/tbc/1934.htm

### MicroSurvey STAR*NET (v10 Reference Manual — первичный источник вендора)
Источник: https://www.engineeringsurveyor.com/software/starnet-v10-manual.pdf (MicroSurvey STAR*NET
Reference Manual, v10; текст извлечён и цитируется дословно).

**Что есть (обнаружение):**
- Стандартизированный остаток (StdRes) с автофлагом: «Standardized Residuals usually have a value
  greater than 3.0 before we can really say that there is a problem. **Values greater than 3.0 are
  flagged with "*" to help you locate them quickly.**» (гл. 9.10)
- Отдельный режим **Blunder Detect** (гл. 7.2): «a modified form of adjustment that can be used to
  find various types of blunders… functions by performing several iterations, successively
  deweighting observations that do not fit into the network in an attempt to isolate those
  observations that contain blunders.» Выдаёт секцию «Differences From Observations» и «Largest
  Difference from Observed Angle».
- Chi-square тест, Error Factor по типам данных, loop closure check (v7+), Preanalysis (анализ
  геометрической прочности сети до выезда).

**Ключевые ограничения, названные самим вендором:**
- «**The cause of any flagged values should be investigated.** However, no observation should be
  deleted until a good reason is found for the problem. **A large residual in a particular observation
  may be the result of a blunder in some other observation.**» (гл. 9.10)
  → Это и есть прямое признание: софт локализует подозрительное число, интерпретацию и поиск
  причины оставляет человеку; и предупреждает про «размазывание» (smearing) — почему наивное чтение
  большого остатка приводит к неверному выводу.
- «Blunder Detect will be of little or no help in determining blunders in simple traverses»;
  «You should not run Blunder Detect "just to see if things are OK", because it may give you
  misleading indications of problems when there are none.» — то есть инструмент требует
  экспертного суждения о том, когда его вообще применять.

**ВАЖНО для оценки новизны — контр-довод.** Глава **9.17 «LOCATING THE SOURCE OF ERRORS»** — это
уже почти то, что описано в гипотезе, но **в виде статического текста руководства, а не автоматики**:
- Список типовых причин: «1. Incorrect data entry — digits transposed, station names wrongly entered,
  typing errors in controlling coordinate values; 2. Options set incorrectly such as angle station
  order set to "At-From-To" but should be "From-At-To"; 3. For grid jobs, the zone set incorrectly or
  geoid height not entered properly; 4. Field data collection blunders — wrong stations observed,
  station names incorrectly entered; 5. Incorrect assignment of standard errors…; 6. Systematic
  errors in field data — EDM out of calibration; 7. Invalid geometry of the network…; 8. Weak network
  geometry — poor intersection angles, lack of redundancy.»
- И **пронумерованный порядок проверки из 16 шагов** («Here are a few suggested steps that you can
  take to determine the source of adjustment problems»), в т.ч.: 1) просмотреть Error File,
  2) проверить настройки проекта, 5) Data Check Only + графический просмотр сети, 7) сравнить Error
  Factor по типам данных, 8) искать StdRes > 3.0 и **«Look for a pattern of the same station being
  associated with multiple large residuals»**, 10) минимально-ограниченное уравнивание с
  последовательной фиксацией опорных точек по одной, 13) `.DATA OFF/.DATA ON` для отсечения кусков,
  14) снятие веса `*` с подозрительных наблюдений, 16) Blunder Detect.
- И прямая фраза о том, что это навык, а не функция: «**As you gain experience, these steps will
  become second nature, and you will often be able to sense the cause of the problems without having
  to proceed in a step by step fashion.**»

**Вывод по STAR*NET:** экспертная процедура диагностики (причины + порядок проверки) **уже
формализована вендором в тексте**, но **не автоматизирована**: программа не применяет её к
конкретному датасету и не выдаёт гипотезу вида «вероятно сбит репер №3, проверь его первым».
Это ослабляет новизну *знания*, но подтверждает отсутствие *автоматизации*.

### Leica Infinity
- Вендор: «Create an adjustment report to check for possible outliers among observations… remove the
  outliers and re-run an inner-constrained adjustment until all observations are within the defined
  tolerances of accuracy and reliability»; поддержка loop misclosure в 1D/2D/3D для выявления
  промахов. — https://leica-geosystems.com/products/gnss-systems/software/leica-infinity/network-adjustment
  и .../capabilities/adjustment
- Учебный материал вендора «Advanced Network Adjustment» описывает workflow: настройки → проверка
  невязок петель → pre-analysis → inner-constrained adjustment → просмотр accuracy/reliability →
  constrained adjustment. То есть **процедура задана человеку**, решение об исключении наблюдения —
  за человеком. Указаний на причину (высота инструмента, призменная постоянная, сбитая опорная точка)
  в материалах не обнаружено.
  (Замечание: PDF на fgg-web.fgg.uni-lj.si в момент проверки отдавал 503; выводы сделаны по
  описаниям вендора и оглавлению документа. — **допущение**, требует доп. проверки при доступе к PDF.)

### Topcon MAGNET Tools / MAGNET Office
- «MAGNET's blunder treatment options have been updated to include **"Automatic Blunder
  Reweighting"**» — MAGNET Software System v7 Release Notes, 12 марта 2021,
  https://img1.wsimg.com/blobby/go/d83f37e5-50ec-4ba5-8c39-635df16b7b4e/downloads/MAGNET%20Release%20Notes%20v%207.pdf
- «A full statistical report containing the results of the least squares adjustment is produced and
  written to the report (.RPT) file.»
- То есть автоматика есть — но она **перевешивает промах, а не объясняет его**. Автоматическое
  перевзвешивание даже снижает шанс, что оператор поймёт причину: промах «растворяется» в отчёте.

### Carlson SurvNET
Источник: справка Carlson 2019 / Carlson 2015,
https://files.carlsonsw.com/mirror/manuals/Carlson_2019/source/Survey/Survey/SurvNET/Introduction/Introduction.html
и https://files.carlsonsw.com/mirror/manuals/Carlson_2015/.../Process_Menu/
- Три метода обнаружения промахов: (1) проверка нумерации точек — «effective in detecting if the same
  point number has been used for two different points» и наоборот; (2) изоляция одиночного промаха
  без большой избыточности; (3) множественные промахи (требует много избыточности).
- Порог: «a standard residual greater than 2 is marked with an "*"»; «The blunder is most likely in
  the measurement containing the largest residual and standard residual.»
- Есть **зачаток причинной интерпретации**: «If there are consistently a lot of high standard
  residuals it may indicate that the original standard errors set in the Settings dialog box were not
  realistic» — то есть различение «промах в измерении» vs «неверные априорные веса». Это ближе всего
  к диагностике причины среди рассмотренных пакетов, но: (а) это текст справки, (б) различает лишь
  два класса, (в) не относится к полевым причинам (репер, высота, призма).
- Также в справке: «The majority of all problems in processing raw data are related to point
  numbering issues» — вендор сам называет доминирующую причину, но не детектирует её как гипотезу
  в отчёте.

### Trimble GEDO (железнодорожная линия — ближайшая к описанной области)
- GEDO Office / GEDO Doc: «continuous recording of track gauge, cant (superelevation), and twist,
  with **tolerance specifications for track gauge and twist with warning if tolerance is exceeded**»;
  отчёты сравнения проект/факт, геометрия пути, QC-результаты.
  — https://gedo.trimble.com/en/products-and-solutions/gedo-doc и .../gedo-track-system-pre-measurement
- Это **контроль допусков конечного продукта** (геометрия пути), а не диагностика ошибки оператора
  при выгрузке. Порог/предупреждение = обнаружение. Причинной атрибуции в описании нет.

### Trimble Access (полевой софт — момент, когда ошибку ещё можно исправить на объекте)
- Справка Trimble Access, «To review observation residuals and setup results»: «Use the observation
  residual information shown after a station setup plus or resection to review the quality of the
  observations and remove poor observations»; «If the residuals for an observation are high, **it may
  be better to disable the observation from the round**»; предупреждение о смещении решения при
  частичном отключении наблюдений на заднюю точку.
  — https://help.fieldsystems.trimble.com/trimble-access/latest/en/station-setup-residuals.htm
  **Причины не называются.** Это ровно «показали число — решай сам».
- «Resection Computations in Trimble Access», Reference Guide, Rev. C, июнь 2021 (первичный документ
  вендора, текст извлечён): документ **целиком математический** — уравнения наблюдений, веса,
  центрировочные ошибки, вычисление остатков и стандартных ошибок. Ни одного раздела о
  распознавании причины плохой засечки, о сбитой опорной точке или о порядке проверки.
  — https://help.fieldsystems.trimble.com/trimble-access/2021.10/en/PDFs/Access-Resection-Computations.pdf

### Amberg Rail / GRP System FX (ж/д-специфика)
- «**Amberg Compensation Method provides real-time compensation of control point inaccuracies**,
  resulting in improved track geometry quality already during construction» — то есть неточность
  опорных точек **компенсируется автоматически**, а не диагностируется и не предъявляется оператору
  как «репер такой-то сбит».
  — https://www.railway-technology.com/contractors/overhaul/amberg-technologies/ (проф. отраслевой
  профиль вендора), описание Amberg Rail
- «GRP Fidelity» — «integrated quality management system… extensive calibrating and inspection system
  for reliable and high-precision track gauging trolleys»: это **калибровка и поверка железа**
  (тележки), а не диагностика ошибок оператора по данным.
- На официальной странице Amberg Rail технических деталей по обнаружению ошибок и диагностике причин
  не приводится вовсе. — https://ambergtechnologies.com/solutions-services/amberg-rail

**Промежуточный вывод по п.1–2 (вендоры):** обнаружение автоматизировано широко и давно
(tau/Baarda/data snooping, StdRes с флагом, chi-square, loop closure, автоперевзвешивание,
предупреждения по допускам). **Автоматической атрибуции причины не нашлось ни у одного из шести
пакетов.** Ближайшее, что есть: (а) статические текстовые главы-руководства «где искать источник»
(STAR*NET гл. 9.17), (б) одно бинарное различение в справке Carlson («много больших StdRes → скорее
всего неверные априорные веса, а не промах»), (в) авто-компенсация неточностей опорных точек у Amberg
(лечит симптом, скрывает причину).

---

## 3. Порог понятности отчётов

Прямых количественных исследований («сколько % новичков неверно читают отчёт об уравнивании»)
найти не удалось — **это слабое место доказательной базы, помечаю как непроверенное**.
Косвенные свидетельства от первичных источников:

- STAR*NET Reference Manual, гл. 9.17: «As you gain experience, **these steps will become second
  nature, and you will often be able to sense the cause of the problems** without having to proceed
  in a step by step fashion.» И далее: «MicroSurvey Software Inc. will try to help you resolve
  problems. **We do request that you attempt to resolve them by following these steps before you
  call**» — вендор прямо признаёт, что (а) диагностика — навык, приобретаемый опытом, (б) поток
  обращений в поддержку по этому поводу существует и его сдерживают чек-листом.
- Тот же манул: «no observation should be deleted until a good reason is found for the problem»
  и «a large residual… may be the result of a blunder in some other observation» — предупреждение
  ровно о том типовом заблуждении новичка (удалить наблюдение с максимальным остатком).
- Carlson: «The majority of all problems in processing raw data are related to point numbering
  issues» — то есть доминирующая ошибка примитивна и всё равно не ловится автоматически как причина.
- Ghilani, C.D. «What Is a Least Squares Adjustment Anyway?», xyHt, 25.08.2016 — статья написана
  в жанре демистификации, но прямых утверждений о непонимании отчётов не содержит.
  https://www.xyht.com/surveying/least-squares-adjustment-anyway/

**Вывод по п.3:** утверждение «новички не читают/читают неверно» правдоподобно и косвенно
поддержано формулировками вендоров, но **строгих данных нет**. Это дыра, которую надо закрывать
интервью, а не десктоп-ресёрчем. — допущение.

---

## 4. Академический фронт

### 4.1 Ключевое: даже формальная теория останавливается на «какое наблюдение», а не «почему»
Zaminpardaz S., Teunissen P.J.G. «DIA-datasnooping and identifiability», *Journal of Geodesy*, 2018.
https://pmc.ncbi.nlm.nih.gov/articles/PMC6383761/
DIA = Detection, Identification, Adaptation — самый строгий существующий каркас для «идентификации»
ошибок модели. Но:
- Альтернативные гипотезы на практике = «в наблюдении i есть выброс»: авторы «restrict our attention
  to this important case» — «only one observation at a time is affected by an outlier».
  То есть **Identification в DIA — это идентификация наблюдения, а не физической причины.**
- Неразличимость гипотез признана: «identification of hypotheses becomes problematic if the
  misclosure vector has the same distribution under different hypotheses». Предлагаемые выходы —
  **перемер, адаптация или объявление решения недоступным**, а не диагноз.
- MDB / MIB (minimal detectable / identifiable bias) — метрики способности обнаружить и
  идентифицировать смещение; в Leica Infinity и подобных они выводятся как «reliability».

**Оговорка / потенциальное опровержение в теории.** DIA формально допускает альтернативные гипотезы
любого вида, в т.ч. параметризованные физически (смещение высоты антенны на пункте X, масштабная
ошибка EDM, азимутальное смещение). Если бы кто-то составил каталог физических гипотез и прогонял их
через DIA — это была бы автоматическая диагностика причины. **Такой реализации в найденных
источниках нет ни в софте, ни в статьях.** Возможность есть, продукта нет.

### 4.2 Терминологическое подтверждение разрыва «обнаружение ≠ причина»
Rofatto V. et al. (и соавторы), «OUTLIER = GROSS ERROR? DO ONLY GROSS ERRORS CAUSE OUTLIERS IN
GEODETIC NETWORKS?», *Boletim de Ciências Geodésicas* (SciELO Brazil), 2019.
Тезис: «a gross error is a type of error, while an outlier is a type of observation, and they are not
synonyms… a gross error does not always cause an outlier and not all outliers are caused by gross
errors». Прямо означает: **обнаружение выброса не даёт причину** — она может быть в модели, в весах,
в геометрии, а может отсутствовать вовсе.
(Полный текст SciELO отдавал 403 при прямой загрузке; цитаты — по аннотации и индексации.)

### 4.3 Машинное обучение — тоже только детекция
- «A meta-classification-based approach for outlier identification in GNSS networks», *GPS Solutions*
  (Springer), 2024, DOI 10.1007/s10291-024-01775-8. Мета-классификатор на MLP поверх iterative
  data-snooping, MinL1, SLRT и MinL∞. Признаки — бинарные решения базовых классификаторов и их
  статистики. **Выход — бинарная классификация «выброс / не выброс» по наблюдению.** Классификации
  причины нет. Готовой реализации в продукте нет (исследовательская статья).
- «Minimum-variance-based outlier detection method using forward-search model error in geodetic
  networks», *Geoscientific Model Development* 17, 2187, 2024.
  https://gmd.copernicus.org/articles/17/2187/2024/ — снова **detection**.
- Kim, Kim, Li «Study on detection of gross error in geodetic network adjustment», *Geodesy and
  Cartography* (PAN), https://journals.pan.pl/Content/103264/PDF/art04.pdf — робастное оценивание,
  пороги стандартизированных остатков 1.0–1.5. Detection.

**Вывод по п.4:** академический фронт за 40+ лет (Baarda 1968 → data snooping → DIA → ML-мета-
классификаторы 2024) плотно закрыл **обнаружение и локализацию наблюдения**. Работ по
**автоматической атрибуции физической причины** (сбитый репер / высота инструмента / призменная
постоянная / геометрия засечки / температурная поправка) с готовой реализацией не найдено.


---

## 2-БИС. САМОЕ СИЛЬНОЕ НАЙДЕННОЕ ОПРОВЕРЖЕНИЕ (частичное)

### Leica GeoMoS Adjustment — автоматическая атрибуция ОДНОЙ причины: «сбит репер»
Страница вендора https://leica-geosystems.com/products/total-stations/software/leica-geomos-adjustment
дословно: «**Distinguish movement of the structure from problems in the reference frame. Identify
which reference points are stable and which are not.**», «Automatic detection of outliers»,
«Statistically qualify the movements – is it really moving?».
Сопутствующие описания (GIM International, GIS Resources, дистрибьютор NSS): «unstable reference
points and monitoring points that have significant movements are clearly identified»; «robust
adjustment… automatic outlier detection and removal».

**Это реальная автоматическая диагностика причины**: софт отличает «объект сдвинулся» от
«опорная сеть поехала» и называет, какие именно опорные точки нестабильны. Ровно тот тип вывода,
который гипотеза считает отсутствующим («вероятно сбит репер №3»).

Академическая база под этим давно есть и реализована в нескольких пакетах деформационного анализа:
глобальный congruency-тест (Niemeier, 1981), пошаговая процедура выявления нестабильных опорных
точек, subnetwork-анализ, минимизация L1-нормы вектора смещений опорных точек.
См., напр.: Chen/Chrzanowski «A strategy for the analysis of the stability of reference points in
deformation surveys», *Geomatica*, 1990, https://cdnsciencepub.com/doi/10.1139/geomat-1990-0016;
«Geodetic Applications and Improvement of the X- and L-Method of Deformation Analysis»,
*Geosciences* 13(11):330, 2023, https://doi.org/10.3390/geosciences13110330.

**НО — почему это не закрывает описанную нишу целиком:**
1. **Другой класс задач.** Это мониторинг деформаций: многоэпоховые повторные измерения одной и той
   же сети со стационарной установки. Описанный в гипотезе сценарий (установка тахеометра на репер,
   обратная засечка, измерение на призму тележки, вынос оси) — **одноэпоховая работа**, где
   congruency-теста между эпохами просто нет.
2. **Одна причина из списка.** Нестабильность опорной точки — единственная диагностируемая причина.
   Неверная высота инструмента, не та призменная постоянная, слабая геометрия засечки, невведённая
   температурная поправка, неверный порядок наблюдений, отсутствие повторов — не диагностируются.
3. **Нет порядка проверки.** По собственному описанию вендора страница «does not provide claims about
   telling users what corrective actions to take» — выдаётся статистика и метка «нестабильна»,
   а не «проверь такой-то репер первым, потому что …».
4. **Автоудаление выбросов работает против диагностики.** «Automatic outlier detection and removal»
   и «Automatic Blunder Reweighting» у Topcon удаляют/гасят промах — оператор не узнаёт, что сделал
   не так, и повторит ошибку.

**Итог по этому пункту:** порог опровержения из ТЗ («не только обнаружение, но и диагностика причины
С ПОРЯДКОМ ПРОВЕРКИ») **не достигнут даже здесь**: причина — одна и без порядка проверки.
Но утверждение «диагностики причины нет вообще» — **неверно** и должно быть смягчено.


### ВТОРОЕ СИЛЬНОЕ ОПРОВЕРЖЕНИЕ: КРЕДО ДАТ (ТИМ КРЕДО ДАТ) — ближе всех к гипотезе
Первичный источник: руководство пользователя КРЕДО ДАТ (253 стр., PDF дистрибьютора «ПРИН»,
https://www.prin.ru/images/documents/instrukcii/credo/dat/dat.pdf; текст извлечён и цитируется).
Это ключевой пакет для РФ/СНГ, в т.ч. в дорожно-железнодорожном контуре.

Что в нём есть сверх «показали красное число»:
1. **Задан порядок проверки — прямо в софте и в документации:** «Рекомендуется поэтапное применение
   каждого из этих методов. **Как правило, поиск начинается с выполнения L1-анализа**, что в лучшем
   случае позволяет **сразу установить источник ошибки**, в худшем — локализовать ход или участок
   сети, содержащие ошибочные измерения. **Затем** при необходимости подозрительные измерения
   анализируются с помощью **методов трассирования и выборочного отключения**.» И далее: метод
   последовательного отключения — «последнее, но надёжное средство».
2. **Классификация типа ошибки (угловая / линейная / высотная):** L1-анализ «позволяет… выделить
   участок сети, ход или даже отдельное измерение, содержащее **грубую угловую, линейную или
   высотную** ошибку». Через баланс весов: «задав малый весовой коэффициент для угловых уравнений,
   имитировать безошибочность измерения расстояний, и наоборот… Анализ поправок углов в первом
   случае и поправок в расстояния во втором часто помогает выделить грубые ошибки».
3. **Локализация ошибки к конкретному пункту (по сути — метод трассирования):** «**Максимальная
   угловая ошибка присутствует при пункте, на котором расхождение координат, полученных из хода
   "прямо" и "обратно", минимально**»; линейная ошибка — «дирекционный угол стороны с грубой
   линейной ошибкой равен с точностью до 180° дирекционному углу невязки прямой или обратной трассы».
4. **Отдельная функция «сбит репер»:** команда `Расчёты / Поиск ошибок / Общий анализ исходных
   данных` — «**Поиск грубых ошибок координат и высот исходных пунктов**, дирекционных углов
   производится методом последовательного исключения их из обработки… с последующим анализом СКО
   единицы веса (µ) для всех вариантов. **Минимальное значение µ может указывать на наличие грубой
   ошибки исходных данных.**» Плюс `Анализ координат исходных пунктов ГНСС` — «предназначена для
   выявления грубых ошибок координат (или измерений) исходных пунктов». В L1-анализе: «При
   установленном флажке Учёт ошибок исходных данных **анализируются и выделяются ошибки координат
   и высот исходных пунктов**; выявленные грубые ошибки отображаются в ведомостях L1-анализа
   в отдельном разделе».
5. **Знает про «размывание» ошибки:** метод трассирования «желательно использовать с данными,
   полученными после предобработки, а не после уравнивания, так как в последнем случае происходит
   размывание ошибки в соседние направления и линии за счёт вычисленных поправок».

**Насколько это закрывает гипотезу.** Закрывает существенно больше, чем западные пакеты:
классификация типа ошибки + локализация к пункту/стороне + отдельная процедура «какой исходный
пункт неверен» + рекомендованная последовательность методов. Формулировка «вероятно, ошибка
в координатах исходного пункта X — проверь его» в КРЕДО ДАТ **фактически достижима штатными
средствами**.

**Чего всё равно нет:**
- Границы применимости жёсткие и оператору неочевидны: L1-анализ «эффективен, когда число грубых
  ошибок меньше трети избыточных измерений»; «для теодолитного хода с координатной привязкой…
  такой анализ вовсе неприемлем»; «Общий анализ исходных данных» — «метод эффективен в сетях,
  имеющих не менее 4-х исходных пунктов, неприменим для одиночных теодолитных ходов». В сценарии
  «станция + обратная засечка + вынос оси» избыточность часто ниже этого порога — и тогда весь
  аппарат не работает.
- Причина всё ещё **математическая, а не полевая**: «грубая угловая ошибка на пункте N» ≠ «ты
  ввёл не ту высоту инструмента» / «призменная постоянная от другой призмы» / «не введена
  температурная поправка» / «плохая геометрия засечки — контрольные точки в створе».
- Порядок проверки — **статический текст руководства**, одинаковый для любого проекта, а не
  ранжированный список гипотез под конкретный датасет.
- Ничего про процедурные ошибки: порядок наблюдений, отсутствие повторных измерений, работа
  при одном приёме, отсутствие контрольного измерения на известную точку.

### Прочие проверенные и не давшие опровержения
- **Esri ArcGIS Data Reviewer** — «library of no-code, ready-to-use checks that identify common errors
  found in GIS data»; batch jobs, attribute rules. Это правиловая валидация ГИС-данных (топология,
  атрибуты, целостность), **не измерений**, и снова только обнаружение.
  — https://www.esri.com/en-us/arcgis/products/arcgis-data-reviewer/overview,
    https://pro.arcgis.com/en/pro-app/latest/help/data/validating-data/an-overview-of-data-reviewer-checks-in-arcgis-pro.htm
- **Halff (инженерная фирма), «Leveraging AI for the Next Generation of Survey & Geospatial
  Insights», 18.03.2025:** «AI-driven quality control will further detect inconsistencies and
  anomalies, ensuring precise and reliable survey outputs» — на 2025 год отраслевое видение ИИ в
  геодезическом QC ограничивается **детекцией аномалий**; объяснение причин остаётся за человеком.
  — https://halff.com/news-insights/insights/leveraging-ai-for-the-next-generation-of-survey-geospatial-insights/

---

## 5. Смежные рынки: где связка «паттерн → класс причины» уже автоматизирована

Перенос возможен, и прецеденты сильные — но нигде это не доведено до «конкретной полевой причины».

### 5.1 Клиническая лаборатория: правила Вестгарда (сильнейший прецедент)
Westgard QC (westgard.com), многоправило (multirule) QC:
- «A potential advantage of a multirule procedure is that **the rule violated can provide a clue
  about the type of analytical error occurring**: violations of rules such as 2-2s, 4-1s, and 8x are
  more likely due to **systematic** errors, whereas violations of 1-3s and R4s are likely due to
  **random** errors.» — https://www.westgard.com/lesson18.htm, https://www.westgard.com/westgard-rules.html
- И далее приводится **список физических причин под каждый класс**: случайные — «incomplete mixing,
  bubbles or particles in reagents, probe and syringe variations, optical problems, sample line
  problems»; систематические — «inaccurate standards, poor calibration, inadequate blanks, improperly
  prepared reagents, reagent degradation, detector drift, improper temperature settings».
- **Автоматизировано в проде:** LIMS/middleware применяют правила Вестгарда автоматически, строят
  Levey-Jennings и триггерят алерты.
**Структура, которую хочет гипотеза, в лабораторной диагностике реализована**: паттерн нарушения →
класс ошибки → короткий список причин. Но и там конечный список причин — текст в методичке, а не
ранжированная гипотеза под конкретный прогон.

### 5.2 Производство / SPC: Western Electric и Nelson rules + распознавание паттернов
- Правила WECO/Nelson: набор паттернов (выход за 3σ, тренд, сдвиг, цикл, систематика), автоматически
  применяются в MES-платформах, триггерят алерт; **root cause investigation — человеческая
  процедура**. — https://www.qualitygurus.com/nelson-rules-and-western-electric-rules-for-control-charts/,
  https://www.parsec-corp.com/blog/nelson-vs-western-electric
- Академическое направление **CCPR (control chart pattern recognition)** нейросетями: классификация
  в типы normal / upward-downward shift / increasing-decreasing trend / cyclic / systematic;
  «**every non-random pattern is mapped to a set of assignable causes**, and if the pattern type can
  be correctly recognized… it will help to diagnose the possible causes».
  — напр. MDPI *Mathematics* 11(15):3291, 2023 (multi-channel deep CNN);
    MDPI *Applied Sciences* 12(2):787, 2022 (multi-label CNN);
    *Journal of Intelligent Manufacturing*, DOI 10.1023/A:1008975131304.
  Это **прямой методологический шаблон** для геодезической задачи: обучить классификатор на паттернах
  ряда и получить класс причины, а не только флаг выброса. В геодезии такого не сделано.

### 5.3 Метрология / КИМ (CMM)
Таксономии источников ошибок расписаны (аппаратные, деталь, стратегия ощупывания, алгоритм
аппроксимации, внешние), выделены операторские ошибки — «Alignment errors commonly happen because a
CMM operator cannot correctly define a workpiece coordinate system»; есть методы компенсации
(температурная, программная, по усилию). — https://www.wasyresearch.com/error-sources-on-coordinate-measuring-machine-cmm-measurements-and-environment-control/,
https://www.ipqcco.com/blog/what-are-the-possible-errors-in-cmm-...
**Автоматической диагностики ошибки конкретного оператора по его прогону — не найдено.** Та же
картина: компенсация и таксономия есть, атрибуции нет.

---

## 6. Кто продаёт QA геоданных как услугу/продукт

- **Услуга, человеческая, существует и институционализирована.** «All as-built deliverables from the
  contractor must be tested by **an independent auditor** to verify quality and accuracy of each
  submittal before acceptance» — практика приёмки исполнительной документации.
  Отраслевые примеры: Castle Surveys (UK) — «Quality Assurance Surveys & Reports»
  https://castlesurveys.co.uk/services/quality-assurance-surveys-reports/; Original Survey Solutions
  — «As-Built Surveys and QA/QC» https://oss.net/services/as-built; Intersect Surveys — Construction
  Verification As-Built https://intersectsurveys.co.uk/blog/construction-verification-as-built-ensuring-quality-compliance
- **В РФ/СНГ** это «контрольная геодезическая съёмка» / «геодезический контроль» — массовая услуга
  подрядного рынка (напр. sever-geo.ru, geotop.msk.ru, vsp74.ru), продаётся как выезд бригады, а не
  как проверка данных.
- **Нормативная рамка приёмки** задаёт выборочный человеческий контроль: DOT-регламенты (ODOT
  Project Delivery Quality Program Manual; FDOT 2026 FDM 124 QA/QC Management Plan — требование, что
  QC Reviewer не участвовал в разработке deliverable), NASSCO — «minimum of 5% of Surveys be checked».
- **Продукта «загрузи сырые измерения — получи диагноз ошибки оператора» не найдено.** Ближайшие
  категории на рынке: (а) валидация ГИС-данных по правилам (Esri Data Reviewer), (б) PDQ-проверка
  CAD-моделей (Q-Checker, TECHNIA — https://www.technia.com/en/quality-compliance/software/q-checker/),
  (в) мониторинг деформаций с анализом стабильности реперов (Leica GeoMoS Adjustment).

---

## ВЕРДИКТ

**ЗАКРЫТО ЧАСТИЧНО.** Заявленный порог опровержения формально **не достигнут**: ни один пакет не
даёт одновременно (а) атрибуцию **физической** причины ошибки оператора и (б) **ранжированный под
конкретный датасет порядок проверки**. Но исходная формулировка «диагностики нет» **избыточно
сильна** и в таком виде неверна.

### Что УЖЕ автоматизировано (это брать нельзя, это конкуренты)
1. **Обнаружение и локализация подозрительного наблюдения** — закрыто наглухо, 50+ лет: Baarda
   data snooping, tau-тест (TBC), StdRes > 2–3 с флагом «*» (STAR*NET, Carlson), chi-square,
   loop closure, Blunder Detect, автоперевзвешивание (Topcon), робастное оценивание.
2. **Классификация типа ошибки: угловая / линейная / высотная / в исходных данных** — КРЕДО ДАТ,
   L1-анализ + баланс весов + трассирование.
3. **«Какой исходный пункт (репер) неверен»** — КРЕДО ДАТ, «Общий анализ исходных данных» методом
   последовательного исключения по СКО единицы веса; Leica GeoMoS Adjustment — «Identify which
   reference points are stable and which are not» (для многоэпохового мониторинга).
4. **Различение «промах в измерении» vs «неверные априорные веса»** — Carlson SurvNET (в справке).
5. **Оценка того, можно ли вообще что-то обнаружить/идентифицировать** — MDB/MIB, reliability
   (Leica Infinity), Preanalysis (STAR*NET).
6. **Автокомпенсация неточных опорных точек в ж/д** — Amberg Compensation Method (реального времени).
7. **Проверка допусков конечного продукта в ж/д** — GEDO Office/Doc: колея, возвышение, перекос
   с предупреждением о выходе за допуск.
8. **Экспертный порядок проверки** — формализован, но **как статический текст руководства**:
   STAR*NET гл. 9.17 (16 пронумерованных шагов + 8 типовых причин), КРЕДО ДАТ (L1 → трассирование →
   выборочное отключение).

### Что НЕ автоматизировано (свободная зона)
1. **Атрибуция физической/процедурной причины полевой работы**: неверная высота инструмента или
   отражателя, чужая призменная постоянная, невведённая температурно-барометрическая поправка,
   слабая геометрия обратной засечки (контрольные точки в створе / малый угол), неверный порядок
   наблюдений, отсутствие повторных приёмов, отсутствие контрольного измерения на известную точку.
   Ни один из шести проверенных пакетов такого вывода не делает. Академически тоже нет: DIA
   (Zaminpardaz & Teunissen, J. Geodesy 2018) явно ограничивает альтернативные гипотезы случаем
   «в наблюдении i есть выброс»; ML-фронт (GPS Solutions 2024) — бинарная классификация
   «выброс / не выброс».
2. **Ранжированный под конкретный датасет порядок проверки** («проверь сначала это, потому что…»).
   Существующие порядки — одинаковые для всех проектов текстовые чек-листы.
3. **Диагностика при низкой избыточности.** Все сильные методы требуют избыточности: L1-анализ —
   «эффективен, когда число грубых ошибок меньше трети избыточных измерений», «для теодолитного хода
   с координатной привязкой… вовсе неприемлем»; «Общий анализ исходных данных» — «неприменим для
   одиночных теодолитных ходов»; Blunder Detect — «of little or no help… in simple traverses».
   **Именно рабочий сценарий из гипотезы (одна станция, засечка, вынос) чаще всего попадает в эту
   зону.** Это, возможно, самая содержательная свободная ниша: диагностика по процедурным признакам
   ряда (порядок, повторы, время, паттерн приёмов), а не по статистике невязок.
4. **Обучающий контур.** Автоудаление и автоперевзвешивание промахов (Topcon «Automatic Blunder
   Reweighting», GeoMoS «automatic outlier detection and removal») **скрывают ошибку от новичка** —
   он не узнаёт, что сделал не так, и повторяет. Обратной связи оператору как продукта не существует.
5. **Объяснение на языке действия, а не статистики.** Даже КРЕДО ДАТ говорит «грубая ошибка в
   координатах исходного пункта», а не «съезди и проверь репер №3, он, судя по всему, сбит после
   работы техники». Разрыв между математическим диагнозом и полевым действием никем не закрыт.
6. **LLM-слой над отчётами уравнивания.** Работ и продуктов не найдено (поиск по 2025 г. дал только
   LLM для ГИС-аналитики и геоанализа, не для QC измерений).

### Что это значит для решения
- Ниша **не пустая**, как предполагалось, но **и не закрытая**. Наиболее защитимая часть — не
  «найти промах» (это дешёвый коммодити), а:
  (1) перевод математического диагноза в **полевое действие** с приоритетом проверки;
  (2) диагностика **процедурных** ошибок (порядок, повторы, приёмы, геометрия) — они видны в сыром
  ряду и **не покрываются аппаратом уравнивания вообще**;
  (3) работа при **низкой избыточности**, где вся классика бессильна;
  (4) обучающая обратная связь оператору вместо автотихой коррекции.
- Главный риск: заказчик (ж/д, подрядчик) уже платит за КРЕДО ДАТ / TBC и считает, что «поиск ошибок
  у нас есть». Продавать придётся не «детекцию», а **сокращение времени разбора и обучение бригады**.
- Методологический шаблон для реализации существует в смежном рынке: CCPR-классификаторы паттернов
  → assignable causes (SPC) и multirule → тип ошибки → список причин (Вестгард). Перенос никем
  не сделан.

### Слабые места этой проверки (честно)
- **п.3 (порог понятности) доказан слабо** — количественных данных «новички не читают отчёты» найти
  не удалось; есть только косвенные формулировки вендоров. Закрывается интервью, не ресёрчем.
- Leica Infinity проверен по описаниям вендора и вторичным материалам: первичный PDF отдавал 503.
  — допущение.
- SciELO (Rofatto et al.) и Springer (GPS Solutions 2024) отдавали 403 — цитаты по аннотациям
  и индексации, не по полному тексту. — допущение.
- Не проверены: Bentley/OpenRail геодезические модули, Hexagon HxGN, японские/китайские ж/д пакеты,
  внутренние инструменты РЖД (ЦНИИС, ПКБ). Там теоретически может быть ведомственная диагностика.
