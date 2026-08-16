# Проверка названий: товарные знаки, сторы, домены

**Дата проверки:** 16 августа 2026.
**Фильтры на входе:** без слова Protocol (занято фичей Function Health), без Heal / Cure / Relief / Restore.

**Важное ограничение метода.** Прямой доступ к uspto.gov, trademarks.justia.com, trademarkia.com и uspto.report закрыт egress-политикой окружения. Данные по знакам получены из поисковых сниппетов этих же зеркал — этого достаточно, чтобы найти конфликт, и **недостаточно, чтобы объявить его отсутствие**. Это не clearance search. Домены проверены DNS-запросами: наличие A/AAAA-записи означает, что домен занят; отсутствие записи не означает, что он свободен.

---

## Сводка вердиктов

| Название | Знаки | Сторы | Домены | Вердикт |
|---|---|---|---|---|
| **Threshold** | Плотно, но не в цифровом здоровье | Чисто | Всё занято | **Единственное, за которое стоит платить юристу** |
| **Stepwise** | Есть попадание в класс 44 и класс 10 | Забито шагомерами | Всё занято | Снять |
| **Throughline** | Health-конфликт | Занято, два приложения | Всё занято | Снять |
| **Waypoint** | Прямой сосед по категории | Занято | Занято | Снять |
| **Cadence** | Два гиганта | — | Занято | Снять |
| **Course** | Описательное | Безнадёжно | — | Снять |
| **Titrate** | Лекарственная ассоциация | — | Занято, припарковано | Запасное |
| **N-of-1** | Знак жив в здравоохранении | — | Занято | Снять |

---

## 1. Threshold — выживает, но с оговорками

**Товарные знаки.** Слово занято многократно, при этом ни одного попадания в цифровое здоровье я не нашёл:

- **THRESHOLD**, Threshold Shows, PBC — рег. 5927949, серийный 88099965, подан 30.08.2018. Формулировка включает *downloadable mobile applications* — **это класс 9 и это прямое пересечение по товару**, хотя услуги (продажа билетов на домашние концерты) далеки от здоровья.
- **THRESHOLD**, Target Brands, Inc. — рег. по серийному 85465084. Домашний бренд Target: чужая категория, но известный знак с ресурсами на защиту.
- **Threshold Enterprises, Ltd.** — портфель знаков; это крупный дистрибьютор пищевых добавок, то есть **ближайший к wellness сосед** из найденных.
- **THRESHOLD STRATEGIES** — заявка 99137617.

**Common-law риск отдельно и он серьёзный.** «Thresholds» — крупнейший провайдер community mental health в Иллинойсе: основан в 1959 году, более 1300 сотрудников, около 100 площадок, свыше 7000 человек в год. Федеральной регистрации этого имени я не нашёл, но незарегистрированные права в здравоохранении США работают, а сектор — соседний.

**Сторы.** Приложения с названием Threshold в health-категории не найдены. Это плюс.

**Семантическая коллизия, которую стоит взвесить.** В фитнесе threshold прочитывается как лактатный порог и FTP. Пользователь, ищущий «threshold» в сторе, попадёт в выдачу с тренировочными приложениями — ASO будет дороже, чем кажется.

**Домены (все с DNS-записями, то есть заняты):** threshold.com, threshold.co, threshold.health, getthreshold.com, thresholdhealth.com, thresholdapp.com, usethreshold.com, trythreshold.com, jointhreshold.com. Единственный без A-записи из проверенных — **thresholdlabs.com**; проверять у регистратора, отсутствие записи не равно свободе.

**Проверка на слух:** «я прохожу протокол в Threshold» — звучит нормально.

**Что делать.** Это состояние «crowded but not blocked». Реалистичный путь — составной знак (Threshold + второе слово) в классах 9/42/44 плюс платный поиск с заключением о рисках, и заранее принять, что чистый .com не достанется.

---

## 2. Stepwise — снять

Хуже трёх фаворитов по практике, при том что термин действительно клинический.

**Знаки:**
- **STEPWISE**, Stepwise LLC (San Jose) — рег. 7032127, подан 12.08.2021, зарегистрирован 18.04.2023; обучающие курсы в области сбережений.
- **STEPWISE**, серийный 97768657 — трости медицинского назначения (класс 10).
- **STEPWISE PAIN** — услуги здравоохранения и информация в области диагностики боли. **Это класс 44 и прямое попадание в вашу область.**
- **STEPWISE**, FixList, Inc. — рег. 5744336, ПО и услуги в недвижимости.

**Компании:** Stepwise Health (Winston-Salem, NC) — функциональная медицина и health coaching, то есть совпадение и по имени, и по деятельности; Stepwise Health (Ченнаи) — обувь для диабетической стопы.

**Сторы — главный аргумент против.** «StepWise — Step counter» (Google Play), «StepWise — Path to Fitness», «StepWise — Step Counter», «Step+wise», «Learn StepWise». Любое приложение со «step» в имени внутри health-категории проваливается в выдачу шагомеров. Для продукта, который принципиально не про шаги, это дорогая и постоянная путаница.

**Домены:** stepwise.com, stepwisehealth.com, getstepwise.com, usestepwise.com, stepwise.health — все заняты.

---

## 3. Throughline — снять

Семантически лучшее из трёх и практически самое занятое.

- **ThroughLine** (throughlinecare.com) — платформа доступа к верифицированной сети кризисных и суицидальных линий помощи. **Здравоохранение, то же слово, тот же регистр.**
- **Throughline** — приложение в App Store, id1448761577.
- **Throughline Pocket VSM** — второе приложение в App Store.
- **Throughline Group** — тренинги по публичным коммуникациям; отдельно Throughline — коучинг руководителей (LinkedIn, Crunchbase).

**Домены:** throughline.com, throughlinehealth.com, getthroughline.com, throughline.health — заняты.

Имя занято одновременно в здравоохранении, в App Store и в коучинге. Даже при формальной возможности регистрации в узком классе это постоянная борьба за собственное имя в поиске.

---

## 4. Waypoint — снять, самый жёсткий конфликт из всех

**waypointhealth.com — это Waypoint Health Innovations, компания, которая делает «digital apps and online CBT for depression and anxiety».** Программы Thrive (депрессия и тревога) и BT Steps (ОКР), обе с публикациями в клинических испытаниях. Это буквально сосед по полке: цифровые CBT-программы.

Дополнительно: Waypoint Wellness, LLC с знаком AREKAE (серийный 90865123) и услугами «информация в области здоровья, велнеса и питания»; Waypoint Behavioral Health Solutions (ABA-терапия); WAYPOINT как знак у Mobile Crossing, Inc. (серийный 78655124) и ещё несколько владельцев в других отраслях; навигационное приложение Waypoint в App Store.

**Домены:** waypoint.com, waypointhealth.com, waypoint.health — заняты.

---

## 5. Cadence — снять

Убито дважды:

- **Cadence (cadence.care)** — компания удалённого мониторинга пациентов, основана в 2020, привлекла $100M при оценке $1 млрд, работает с гипертонией, диабетом, ХСН и ХОБЛ через партнёрства с системами здравоохранения. Платформа Care in Sync™. Это ровно тот протокол про давление, который вы рассматриваете вторым.
- **Cadence Design Systems** — гигант в классе 9.

Ваша собственная оценка «высокий риск конфликтов» подтверждается полностью.

---

## 6. Course, Titrate, N-of-1

**Course.** Описательное для образовательного продукта и одновременно медицинское («course of treatment»). Слабая регистрируемость, безнадёжный ASO. Снять.

**Titrate.** Проблема не в занятости, а в вашем же ограничении на вывеску: титрование — это подбор дозы лекарства, то есть название начинает регуляторный разговор ровно так же, как Cure или Heal, только на языке врача. Отдельной компании «Titrate» в цифровом здоровье я не нашёл; titrate.com и titratehealth.com отвечают одним и тем же IP (76.223.54.146 — типичный парковочный адрес), то есть заняты и, вероятно, выставлены на продажу. Держать как запасное, если позиционирование сместится в сторону работы с врачом.

**N-of-1.** Помимо названной вами проблемы с произношением: **N-of-One** — компания molecular oncology decision support, куплена Qiagen (объявлено в конце 2018, интеграция в 2019), бренд живёт внутри портфеля QCI. n-of-1.com, nof1.com, nof1health.com заняты. Снять.

---

## 7. Если Threshold не пройдёт clearance — что тестировать следующим

Все три проверены только по доменам, полноценной проверки знаков и сторов по ним я не делал.

**Limen.** Латинское «порог» и технический термин психофизики (absolute limen — порог чувствительности). Тот же смысл, что у Threshold, при этом плотность имени на порядок ниже: ни health-компаний, ни приложений в выдаче не встретилось. Домены limen.com и limen.health отвечают парковочными IP (76.223.54.146 и 3.33.130.190) — заняты, но парковка часто означает «продаётся»; uselimen.com и getlimen.com заняты. Риск — обычный человек не знает слова и не свяжет его с порогом.

**Baton.** Под ту же идею, что и Throughline: передача между протоколами, «закрыли еду — передали эстафету сну». Механика, а не обещание. baton.health и usebaton.com заняты, нужны другие формы.

**Increment.** Буквально шаг прогрессии, ровно то, что делает движок. increment.health — без A-записи (проверять у регистратора). Минус: слово тяготеет к инженерному жаргону.

---

## 8. Что нужно сделать до выбора

1. **Платный clearance-поиск** по Threshold в классах 9, 42, 44 у поверенного — с оценкой риска по Threshold Shows (класс 9, downloadable apps), Target Brands (известность) и common-law правам Thresholds в поведенческом здоровье. Моя проверка этого не заменяет.
2. **Ручной поиск в App Store и Google Play** по точному слову с устройства в США — поисковая выдача в этой сессии по сторам ненадёжна, и по Threshold отсутствие результатов может быть артефактом инструмента.
3. **Запрос у регистратора** по thresholdlabs.com и increment.health — отсутствие DNS-записи не равно доступности.
4. **Проверка парковок** limen.com, titrate.com, threshold-вариантов через брокера: часть из них почти наверняка продаётся, и это может оказаться дешевле составного домена.

---

## Источники

Проверено 16 августа 2026.

- THRESHOLD, Threshold Shows PBC, рег. 5927949 — https://trademarks.justia.com/880/99/threshold-88099965.html
- THRESHOLD, Target Brands, Inc. — https://uspto.report/TM/85465084
- Threshold Enterprises, Ltd., портфель знаков — https://uspto.report/company/Threshold-Enterprises-L-T-D
- Thresholds (Иллинойс), «About» — https://www.thresholds.org/about
- STEPWISE, Stepwise LLC, рег. 7032127 — https://www.trademarkia.com/stepwise-90879760
- STEPWISE, серийный 97768657 — https://trademarks.justia.com/977/68/stepwise-97768657.html
- STEPWISE PAIN — https://trademarks.justia.com/907/90/stepwise-90790591.html
- STEPWISE, FixList Inc., рег. 5744336 — https://trademarks.justia.com/880/98/stepwise-88098740.html
- Stepwise Health (Winston-Salem, NC) — https://www.stepwisehealthws.com/
- StepWise — Step counter, Google Play — https://play.google.com/store/apps/details?id=com.returdev.stepwise
- StepWise — Path to Fitness, App Store — https://apps.apple.com/us/app/stepwise-path-to-fitness/id6502399332
- ThroughLine, кризисные линии — https://www.throughlinecare.com/terms-of-service
- Throughline, App Store — https://apps.apple.com/us/app/throughline/id1448761577
- Throughline Pocket VSM, App Store — https://apps.apple.com/ru/app/throughline-pocket-vsm/id6765920684
- ThroughLine, Crunchbase — https://www.crunchbase.com/organization/throughline-2d86
- Waypoint Health Innovations — https://waypointhealth.com/ и https://waypointhealth.com/programs/
- AREKAE, Waypoint Wellness LLC, серийный 90865123 — https://uspto.report/TM/90865123
- WAYPOINT, Mobile Crossing Inc. — https://uspto.report/TM/78655124
- Cadence (RPM) — https://www.cadence.care/ ; раунд $100M при оценке $1 млрд — https://www.mobihealthnews.com/news/rpm-company-cadence-scores-100m-boosting-valuation-1b
- QIAGEN о покупке N-of-One — https://corporate.qiagen.com/English/newsroom/press-releases/press-release-details/2019/QIAGEN-acquires-N-of-One-expanding-its-clinical-bioinformatics-capabilities-in-molecular-oncology-decision-support/default.aspx
