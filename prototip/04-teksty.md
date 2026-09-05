# Тексты прототипа — единый источник строк

Ключ → русский → английский. В коде — один файл локализации с этими
ключами; строк в разметке нет. Английский — основной, на нём макеты.
Правило: нигде нет слов «нельзя», «уберите», «диагноз», «лечит», «вы
пропустили», «серия»; проверяется грепом (см. `05-priemka.md`).
Подстановки — в фигурных скобках.

## Общие · common

| Ключ | RU | EN |
|---|---|---|
| common.demoData | демо-данные | demo data |
| common.demoMoment | Момент: {moment} | Moment: {moment} |
| common.today | Сегодня | Today |
| common.map | Карта | Map |
| common.ask | Спросить | Ask |
| common.back | Назад | Back |
| common.ok | Понятно | Got it |

## Группы · group

| Ключ | RU | EN |
|---|---|---|
| group.fructans | фруктаны | fructans |
| group.gos | ГОС | GOS |
| group.lactose | лактоза | lactose |
| group.fructose | фруктоза | fructose |
| group.sorbitol | сорбит | sorbitol |
| group.mannitol | маннит | mannitol |
| group.lactose.food | молочное | dairy |
| group.fructans.food | пшеница и лук | wheat and onion |

## Э0 · onb

| Ключ | RU | EN |
|---|---|---|
| onb.title | Первые дни мы ничего не запрещаем — мы смотрим | For the first days we don't restrict anything — we watch |
| onb.q1 | Что беспокоит | What bothers you |
| onb.q1.a | вздутие | bloating |
| onb.q1.b | боль | pain |
| onb.q1.c | стул | bowel habits |
| onb.q2 | Как часто | How often |
| onb.q2.a | реже раза в неделю | less than weekly |
| onb.q2.b | несколько раз в неделю | a few times a week |
| onb.q2.c | почти каждый день | almost daily |
| onb.q3 | Что уже пробовали | What you've tried |
| onb.q3.a | ничего | nothing yet |
| onb.q3.b | убирал продукты сам | cut foods on my own |
| onb.q3.c | с диетологом | with a dietitian |
| onb.health | Разрешить Health | Allow Health |
| onb.healthOn | Health подключён | Health connected |
| onb.start | Начать | Start |
| onb.disclaimer | Наблюдения, не диагноз. Решения о лечении — у врача. | Observations, not a diagnosis. Treatment decisions stay with your doctor. |

## Today · today

| Ключ | RU | EN |
|---|---|---|
| today.day0 | Сегодня вечером — первая карта дня | Tonight — your first day card |
| today.closeDay | Закрыть день | Close the day |
| today.closed | День записан. Первый вывод — через {n} дн. | Day saved. First insight in {n} days. |
| today.observationFrom | Наблюдение от {date} | Observation from {date} |

## Э1 · day

| Ключ | RU | EN |
|---|---|---|
| day.title | Карта дня · {date} | Day card · {date} |
| day.belly | Живот | Belly |
| day.stool | Стул | Bowel |
| day.heavy | Тяжесть | Heaviness |
| day.scale0 | спокойно | calm |
| day.scale5 | сильно | strong |
| day.background | Сон {sleep} · {steps} шагов · пульс {hr} · {source} | Sleep {sleep} · {steps} steps · resting HR {hr} · {source} |
| day.source.health | Health | Health |
| day.alcohol | Алкоголь | Alcohol |
| day.illness | Болел | Unwell |
| day.blood | Кровь в стуле | Blood in stool |
| day.addMeal | Добавить еду | Add a meal |
| day.close | Закрыть день | Close the day |
| day.closedToast | День записан | Day saved |

## Э1а · meal

| Ключ | RU | EN |
|---|---|---|
| meal.photo | Фото | Photo |
| meal.voice | Голосом | Voice |
| meal.text | Текстом | Type |
| meal.recognized | {dish} · {groups} | {dish} · {groups} |
| meal.noGroups | без отслеживаемых групп | no tracked groups |
| meal.isProbe | Это ваша проба на сегодня — засчитано | This is today's test dose — counted |
| meal.confirm | Верно | Correct |
| meal.fix | Исправить | Fix |
| meal.saved | Записано | Saved |
| meal.preset1 | Овсянка с молоком | Oatmeal with milk |
| meal.preset2 | Салат цезарь | Caesar salad |
| meal.preset3 | Паста с чесноком | Garlic pasta |
| meal.preset4 | Яблоко | Apple |
| meal.preset5 | Рис с курицей | Chicken and rice |

## Э2 · insight

| Ключ | RU | EN |
|---|---|---|
| insight.title | Неделя данных — первое, что видно | One week in — the first thing we see |
| insight.body | В четырёх из пяти плохих дней ночь была короче шести часов. | In four of your five rough days, the night was shorter than six hours. |
| insight.caveat | Пока это наблюдение, не вывод — данных мало. Про еду говорить рано, и мы не будем гадать. | For now this is an observation, not a conclusion — there isn't much data yet. Too early to talk about food, and we won't guess. |
| insight.ok | Понятно | Got it |

## Э3 · bg, ask

| Ключ | RU | EN |
|---|---|---|
| bg.confidence | {percent}% | {percent}% |
| bg.confidenceLabel | данных достаточно | of the data we need |
| bg.daysLeft | Ещё около {n} дней, чтобы назвать подозреваемого | About {n} more days before we can name a suspect |
| bg.fullDays | полных дней | full days |
| bg.badDays | плохих | rough |
| bg.goodDays | хороших | good |
| bg.ofN | {a} из {b} | {a} of {b} |
| ask.title | Спросить | Ask |
| ask.q1 | Что взять в кафе? | What should I order at a café? |
| ask.a1 | Пока мы наблюдаем, ограничений нет — берите как обычно и сфотографируйте, если удобно. | While we're observing there are no restrictions — order as usual and snap a photo if it's convenient. |
| ask.q2 | Можно ли йогурт? | Is yogurt okay? |
| ask.a2 | Сейчас можно всё. Если йогурт попадёт под подозрение, мы предложим это проверить, а не запретим. | Right now everything's on the table. If yogurt ever comes under suspicion, we'll suggest testing it — not banning it. |
| ask.q3 | Чем заменить молоко? | What can replace milk? |
| ask.a3 | Замены понадобятся только во время проверки, и мы возьмём их из того, что вы и так едите. | You'll only need swaps during a test, and we'll pick them from foods you already eat. |

## Э4 · susp

| Ключ | RU | EN |
|---|---|---|
| susp.label | Подозрение | A suspect |
| susp.body | В {badWith} из {badTotal} ваших плохих дней было {food}. В хороших днях — в {goodWith} из {goodTotal}. | {food} showed up in {badWith} of your {badTotal} rough days. On good days — {goodWith} of {goodTotal}. |
| susp.caveat | Это может оказаться совпадением: примерно четверть таких совпадений ложные. Проверим за восемь дней? | This could be a coincidence — about a quarter of patterns like this turn out to be. Want to test it over eight days? |
| susp.check | Проверим | Let's test it |
| susp.notNow | Не сейчас | Not now |
| susp.other | Другой подозреваемый | Another suspect |
| susp.willReturn | Вернёмся с этим позже. Наблюдение продолжается. | We'll come back to this. Observation continues. |
| susp.otherTitle | Другие совпадения | Other patterns |
| susp.otherItem | {food}: в {badWith} из {badTotal} плохих, в {goodWith} из {goodTotal} хороших | {food}: {badWith} of {badTotal} rough days, {goodWith} of {goodTotal} good |

## Э5 · check, dose, discard

| Ключ | RU | EN |
|---|---|---|
| check.header | Проверка: {food} · день {n} · {phase} | Test: {food} · day {n} · {phase} |
| check.phase.restriction | без {food} | {food}-free |
| check.phase.return | возврат | bringing it back |
| check.restrictionTask | Сегодня без {food}. Замены — из вашего рациона: | Today without {food}. Swaps from your own meals: |
| check.swap1 | овсянка на воде | oatmeal with water |
| check.swap2 | безлактозный сыр | lactose-free cheese |
| check.swap3 | кофе с овсяным молоком | coffee with oat milk |
| check.returnTask | Возврат, доза {step} из 3: {dose} | Bringing it back, dose {step} of 3: {dose} |
| dose.small | четверть стакана | a quarter cup |
| dose.medium | полстакана | half a cup |
| dose.full | стакан | a full cup |
| check.dayCounted | День {n} засчитан | Day {n} counted |
| check.discarded | Сегодня без пробы | No test dose today |
| discard.shortSleep | Ночь {sleep}. Короткий сон сам даёт симптомы, и мы не отличим его от {food}. | Last night: {sleep}. Short sleep causes symptoms on its own, and we couldn't tell it apart from {food}. |
| discard.alcohol | Вчера был алкоголь — он сам даёт симптомы. | There was alcohol yesterday — it causes symptoms on its own. |
| discard.illness | Вы отметили, что болели. | You marked that you were unwell. |
| check.moved | Доза переносится на завтра. Ешьте как обычно. | The dose moves to tomorrow. Eat as usual. |
| check.paused | Вчера без записей. Проверка на паузе, не провалена. | No entries yesterday. The test is paused, not failed. |
| check.resume | Продолжим сегодня | Continue today |
| check.endsOn | Заканчивается {date} | Ends {date} |
| check.legend.done | пройден | done |
| check.legend.discarded | не засчитан | not counted |
| check.legend.today | сегодня | today |
| check.legend.ahead | впереди | ahead |

## Э6 · verdict

| Ключ | RU | EN |
|---|---|---|
| verdict.label | Ответ | The answer |
| verdict.threshold | {food}: до {small} переносится, {full} даёт симптомы | {food}: up to {small} is fine, {full} brings symptoms |
| verdict.thresholdExample | Молоко: до 125 мл переносится, 250 мл даёт симптомы | Milk: up to 125 ml is fine, 250 ml brings symptoms |
| verdict.how | Порог считался от вашего обычного разброса, с одним контрольным днём внутри проверки. | The threshold was measured against your own day-to-day variation, with one control day inside the test. |
| verdict.notConfirmed | Не подтвердилось: разница в пределах вашего обычного разброса | Not confirmed: the difference stayed within your usual range |
| verdict.notConfirmedWhy | {food} можно вернуть. Ограничение, которое вы держали, было лишним — и это тоже ответ. | You can bring {food} back. The restriction you were keeping wasn't needed — and that's an answer too. |
| verdict.next | Следующий подозреваемый: {food} | Next suspect: {food} |
| verdict.toMap | В карту | To the map |

## Э7 · map, Э7а · doc

| Ключ | RU | EN |
|---|---|---|
| map.title | Карта переносимости | Your tolerance map |
| map.checked | проверено: {threshold} | tested: {threshold} |
| map.checkedFine | проверено: переносится | tested: tolerated |
| map.observing | в наблюдении | observing |
| map.empty | Первый ответ появится после первой проверки. | Your first answer will appear after the first test. |
| map.doctorPage | Страница для врача | Page for your doctor |
| doc.title | Наблюдения участника | Participant observations |
| doc.protocol | Протокол | Protocol |
| doc.protocolBody | Наблюдение {from}–{to}. Проверка группы «{group}» {checkFrom}–{checkTo}: {restrictionDays} дн. без группы, возврат в три дозы, один контрольный день. | Observation {from}–{to}. Test of "{group}" {checkFrom}–{checkTo}: {restrictionDays} days without the group, return in three doses, one control day. |
| doc.results | Результаты по группам | Results by group |
| doc.symptoms | Самочувствие, медиана за день | Symptom score, daily median |
| doc.before | до проверки | before the test |
| doc.during | без группы | during restriction |
| doc.after | при возврате | during return |
| doc.disclaimer | Наблюдения участника. Не диагноз и не назначение. | Participant's own observations. Not a diagnosis, not a prescription. |
| doc.share | Поделиться | Share |

## Э8 · red

| Ключ | RU | EN |
|---|---|---|
| red.title | Протокол на паузе | Protocol paused |
| red.body | Вы отметили: {reason}. Это может быть серьёзнее СРК. Обратитесь к врачу — вот что ему показать. | You noted: {reason}. This could be more serious than IBS. Please see a doctor — here's what to show them. |
| red.blood | кровь в стуле | blood in stool |
| red.weightLoss | потерю веса без причины | unexplained weight loss |
| red.night | симптомы, которые будят по ночам | symptoms that wake you at night |
| red.onset50 | что это началось после пятидесяти | that this started after fifty |
| red.doctorPage | Открыть страницу для врача | Open the page for your doctor |

## Служебный · moment

| Ключ | RU | EN |
|---|---|---|
| moment.title | Момент | Moment |
| moment.day0 | День 0 — вход | Day 0 — start |
| moment.day7 | День 7 — первый вывод | Day 7 — first insight |
| moment.background | Фон, 60% | Background, 60% |
| moment.suspicion | Подозрение | Suspect |
| moment.check3 | Проверка, день 3 | Test, day 3 |
| moment.check6discarded | Проверка, день 6 — не засчитан | Test, day 6 — not counted |
| moment.verdict | Ответ — порог | Answer — threshold |
| moment.verdictNotConfirmed | Ответ — не подтвердилось | Answer — not confirmed |
| moment.map | Карта | Map |
| moment.redFlag | Красный флаг | Red flag |
