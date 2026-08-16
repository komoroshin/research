// ---------------------------------------------------------------------------
// Every string the interface shows, in both languages.
// Edit here, never inside components.
//
// House rules for this copy:
//   – no diagnosis words ("intolerance", "allergy", "IBS confirmed")
//   – no promises ("will help", "cures", "you'll feel better")
//   – only observations, amounts and protocol steps
// ---------------------------------------------------------------------------

export const CONTENT = {
  en: {
    brand: 'Threshold',
    caseLabel: 'Case',
    nav: { check: 'Check', today: 'Today', signals: 'Signals', map: 'Map' },
    phase: {
      elimination: 'Base period',
      reintroduction: 'Reintroduction',
      complete: 'Protocol complete',
    },
    groups: {
      lactose: 'Lactose',
      fructans: 'Fructans (wheat)',
      sorbitol: 'Sorbitol',
      gos: 'GOS (legumes)',
      fructose: 'Excess fructose',
    },
    foods: { milk: 'milk', yogurt: 'yogurt' },
    units: { ml: 'ml', g: 'g' },
    outcomes: {
      tolerated: 'No reaction',
      reacts: 'Reaction',
      threshold: 'Reaction above a limit',
      undetermined: 'Undetermined',
      testing: 'Testing now',
      queued: 'Queued',
      pending: 'Not tested yet',
    },

    // -- Screen 1 ----------------------------------------------------------
    check: {
      eyebrow: 'Evening check',
      duration: '20 sec',
      title: 'Say how today went',
      idleHint: 'Tap to speak. No forms.',
      listening: 'Listening',
      transcribing: 'Writing it down',
      parsing: 'Reading it into today’s record',
      transcriptLabel: 'You said',
      fieldsLabel: 'Today’s record',
      fields: {
        bloating: 'Bloating',
        pain: 'Abdominal pain',
        stool: 'Stool form',
        energy: 'Energy',
      },
      levels: { none: 'none', mild: 'mild', moderate: 'moderate', normal: 'normal', low: 'low' },
      scaleNote: 'Own 5-point stool scale. Tap any line to correct it before saving.',
      confirm: 'Save today’s record',
      savedTitle: 'Saved',
      streak: (n) => `${n} evenings logged in a row`,
      transcripts: {
        w1: 'Bit bloated after lunch, maybe a five. No pain today. Bathroom was normal, once this morning. Energy has been low since about three.',
        w4: 'Bit bloated after lunch, maybe a five. No pain today. Bathroom was normal, once this morning. Energy has been low since about three.',
        w8: 'Pretty settled today, only slightly bloated in the evening. No pain. Bathroom normal. Energy still drops mid-afternoon.',
      },
      savedNote: {
        w1: 'Day 6 of 56 · base period, day 6 of 14.',
        w4: 'Day 26 of 56 · lactose challenge, day 2 of 3.',
        w8: 'Day 54 of 56 · all challenges resolved.',
      },
      again: 'Record again',
    },

    // -- Screen 2 ----------------------------------------------------------
    today: {
      eyebrowChallenge: 'Reintroduction',
      dayOf: (d, of) => `Day ${d} of ${of}`,
      challengeTitle: (g) => `${g} challenge`,
      todayDose: 'Today’s amount',
      or: 'or',
      singleFood: 'Stay with one food for all three days — the same group carries different amounts in different foods.',
      ladderLabel: 'Dose ladder',
      ladderStates: { done: 'logged', today: 'today', ahead: 'ahead' },
      noReaction: 'no reaction',
      logDay: 'Log today’s challenge',
      queueTitle: 'Protocol queue',
      washout: (n) => `${n} rest days on the base diet between challenges.`,
      ruleLine:
        'Transition rule, applied automatically: three logged days → rest days until symptoms settle → the next group opens.',
      eliminationTitle: 'Base period',
      eliminationBody: (d, of) => `Day ${d} of ${of}. Nothing to test yet — the record you make each evening sets the line the challenges are measured against.`,
      firstChallengeIn: (n) => `First challenge opens in ${n} days`,
      completeTitle: 'All five groups resolved',
      completeBody: 'Nothing left to test. The map is final unless you repeat the undetermined group.',
      openMap: 'Open the map',
    },

    // -- Screen 3 ----------------------------------------------------------
    signals: {
      eyebrow: 'Signals',
      title: 'Read from your records',
      lag: (h) => `median lag ${h} h`,
      hits: (a, b) => `${a} of ${b} exposures`,
      arrow: '→',
      explainPrimary:
        'On days with wheat, the symptom score rose the following evening in seven of nine cases. On days without it, the score stayed under the reaction line. The gap between eating and the rise was around five hours.',
      disclaimerTitle: 'What this is',
      disclaimer:
        'A pattern found in your own records, not a diagnosis. It rests on nine exposures across fourteen days and can change as you log more.',
      counterTitle: 'No association found',
      counterBody: (g, a, b) =>
        `${g} appears on eight days with one raised evening after it (${a} of ${b}). Not enough to call a pattern — and worth showing, because a product that finds a problem everywhere is not reading anything.`,
      legend: { load: 'symptom load', exposure: 'wheat eaten', line: 'reaction line' },
      axisDay: 'day',
      emptyTitle: 'Signals open after the base period',
      emptyBody: (a, b) =>
        `${a} of ${b} evenings logged. Patterns need the base period finished, otherwise the comparison has nothing to compare against.`,
    },

    // -- Screen 4 ----------------------------------------------------------
    map: {
      eyebrow: 'Tolerance map',
      title: 'What your own tests showed',
      upTo: (amount, unit, food) => `Up to ${amount} ${unit === 'ml' ? 'ml' : 'g'} ${food}`,
      altAmount: (amount, unit, food) => `or ${amount} ${unit === 'ml' ? 'ml' : 'g'} ${food}`,
      reactionAt: (amount, unit, food) => `reaction at ${amount} ${unit === 'ml' ? 'ml' : 'g'} ${food}`,
      repeat: 'Logging gaps during this challenge. Repeat when convenient.',
      baselineTitle: 'Symptom load, self-rated',
      baselineNote: 'Same 0–10 scale you record each evening.',
      weekLabel: (n) => `week ${n}`,
      pendingNote: 'Groups are added here as each challenge closes.',
      docButton: 'Summary for your doctor',
      docClose: 'Close',
      nextTitle: 'Next protocol',
      nextName: { sleep: 'Sleep', bp: 'Blood pressure' },
      nextWhy: {
        sleep:
          'You rated energy low on 31 of 51 evenings, including days without any reaction. That is outside what this protocol tests.',
      },
      nextStart: 'See what it involves',
      doc: {
        title: 'Protocol summary',
        subtitle: 'Prepared by the participant from their own records',
        fields: {
          case: 'Record',
          protocol: 'Protocol',
          protocolValue: 'Structured reintroduction, five groups, three days each',
          dates: 'Dates',
          logged: 'Evenings logged',
          scale: 'Measure',
          scaleValue: 'Self-rated symptom load, 0–10, recorded each evening',
        },
        tableTitle: 'Challenge results',
        cols: { group: 'Group', days: 'Days', result: 'Result' },
        loadTitle: 'Symptom load',
        loadRow: (a, b, w) => `Week 1: ${a} · Week ${w}: ${b}`,
        footer:
          'Observations recorded by the participant. No diagnosis, no treatment recommendation. Amounts refer to single servings tested on consecutive days.',
      },
    },

    // -- Screen 5 ----------------------------------------------------------
    redFlag: {
      eyebrow: 'Protocol paused',
      title: 'This one is not ours to read',
      logged: (when) => `You logged blood in stool ${when}.`,
      body:
        'Threshold does not interpret this symptom and does not continue a protocol after it. The queue is paused where it stood.',
      actionTitle: 'What to do now',
      actions: [
        'Contact a clinician. Same-day if the bleeding is heavy, or with fever, faintness or severe pain.',
        'Take your records with you — the evening logs and the challenge results export as one page.',
      ],
      exportButton: 'Export my records',
      careButton: 'Find care options',
      lockNote: 'The protocol stays paused until you tell us a clinician has seen you. There is no continue button here.',
    },

    // -- Presenter ---------------------------------------------------------
    presenter: {
      label: 'Presenter',
      screens: 'Screen',
      week: 'Week',
      reset: 'Reset',
      hide: 'Hide',
      hideHint: 'H hides this panel',
      showHint: 'Press H for presenter controls',
      redFlagBtn: 'Red flag',
      order: 'Demo order: check → today → signals → map',
    },
  },

  ru: {
    brand: 'Threshold',
    caseLabel: 'Запись',
    nav: { check: 'Чек', today: 'Сегодня', signals: 'Связи', map: 'Карта' },
    phase: {
      elimination: 'Базовый период',
      reintroduction: 'Реинтродукция',
      complete: 'Протокол завершён',
    },
    groups: {
      lactose: 'Лактоза',
      fructans: 'Фруктаны (пшеница)',
      sorbitol: 'Сорбит',
      gos: 'ГОС (бобовые)',
      fructose: 'Избыточная фруктоза',
    },
    foods: { milk: 'молока', yogurt: 'йогурта' },
    units: { ml: 'мл', g: 'г' },
    outcomes: {
      tolerated: 'Реакции нет',
      reacts: 'Есть реакция',
      threshold: 'Реакция выше порога',
      undetermined: 'Не определено',
      testing: 'Тестируется',
      queued: 'В очереди',
      pending: 'Ещё не тестировалось',
    },

    check: {
      eyebrow: 'Вечерний чек',
      duration: '20 сек',
      title: 'Расскажите, как прошёл день',
      idleHint: 'Нажмите и говорите. Без форм.',
      listening: 'Слушаю',
      transcribing: 'Записываю',
      parsing: 'Раскладываю в запись дня',
      transcriptLabel: 'Вы сказали',
      fieldsLabel: 'Запись дня',
      fields: {
        bloating: 'Вздутие',
        pain: 'Боль в животе',
        stool: 'Форма стула',
        energy: 'Энергия',
      },
      levels: { none: 'нет', mild: 'слабое', moderate: 'умеренное', normal: 'обычная', low: 'низкая' },
      scaleNote: 'Собственная 5-балльная шкала стула. Любую строку можно поправить до сохранения.',
      confirm: 'Сохранить запись дня',
      savedTitle: 'Сохранено',
      streak: (n) => `${n} вечеров подряд`,
      transcripts: {
        w1: 'После обеда немного вздуло, где-то на пять. Боли сегодня не было. В туалет сходил обычно, один раз утром. Энергия низкая примерно с трёх.',
        w4: 'После обеда немного вздуло, где-то на пять. Боли сегодня не было. В туалет сходил обычно, один раз утром. Энергия низкая примерно с трёх.',
        w8: 'Сегодня спокойно, вздутие только вечером и слабое. Боли нет. Стул обычный. Энергия всё так же падает после обеда.',
      },
      savedNote: {
        w1: 'День 6 из 56 · базовый период, день 6 из 14.',
        w4: 'День 26 из 56 · челлендж лактозы, день 2 из 3.',
        w8: 'День 54 из 56 · все челленджи закрыты.',
      },
      again: 'Записать заново',
    },

    today: {
      eyebrowChallenge: 'Реинтродукция',
      dayOf: (d, of) => `День ${d} из ${of}`,
      challengeTitle: (g) => `Челлендж: ${g.toLowerCase()}`,
      todayDose: 'Доза на сегодня',
      or: 'или',
      singleFood: 'Все три дня держитесь одного продукта — внутри одной группы количества у разных продуктов отличаются.',
      ladderLabel: 'Лестница доз',
      ladderStates: { done: 'записан', today: 'сегодня', ahead: 'впереди' },
      noReaction: 'реакции нет',
      logDay: 'Записать день челленджа',
      queueTitle: 'Очередь протокола',
      washout: (n) => `${n} дня отдыха на базовой диете между челленджами.`,
      ruleLine:
        'Правило перехода применяется автоматически: три записанных дня → дни отдыха до затихания симптомов → открывается следующая группа.',
      eliminationTitle: 'Базовый период',
      eliminationBody: (d, of) => `День ${d} из ${of}. Тестировать пока нечего — вечерние записи задают линию, относительно которой будут измеряться челленджи.`,
      firstChallengeIn: (n) => `Первый челлендж откроется через ${n} дней`,
      completeTitle: 'Все пять групп закрыты',
      completeBody: 'Тестировать больше нечего. Карта финальная, если не повторять неопределённую группу.',
      openMap: 'Открыть карту',
    },

    signals: {
      eyebrow: 'Связи',
      title: 'Прочитано в ваших записях',
      lag: (h) => `медианная задержка ${h} ч`,
      hits: (a, b) => `${a} из ${b} эпизодов`,
      arrow: '→',
      explainPrimary:
        'В дни с пшеницей оценка симптомов поднималась следующим вечером в семи случаях из девяти. В дни без неё оценка оставалась ниже линии реакции. Промежуток между едой и подъёмом — около пяти часов.',
      disclaimerTitle: 'Что это',
      disclaimer:
        'Закономерность в ваших собственных записях, а не диагноз. Она опирается на девять эпизодов за четырнадцать дней и может измениться с новыми данными.',
      counterTitle: 'Связи не обнаружено',
      counterBody: (g, a, b) =>
        `${g} встречается в восьми днях, и лишь один вечер после него был выше линии (${a} из ${b}). Для закономерности мало — и это стоит показывать: продукт, который находит проблему везде, ничего не читает.`,
      legend: { load: 'оценка симптомов', exposure: 'была пшеница', line: 'линия реакции' },
      axisDay: 'день',
      emptyTitle: 'Связи откроются после базового периода',
      emptyBody: (a, b) =>
        `Записано ${a} вечеров из ${b}. Закономерности требуют завершённого базового периода, иначе сравнивать не с чем.`,
    },

    map: {
      eyebrow: 'Карта переносимости',
      title: 'Что показали ваши собственные тесты',
      upTo: (amount, unit, food) => `До ${amount} ${unit === 'ml' ? 'мл' : 'г'} ${food}`,
      altAmount: (amount, unit, food) => `или ${amount} ${unit === 'ml' ? 'мл' : 'г'} ${food}`,
      reactionAt: (amount, unit, food) => `реакция на ${amount} ${unit === 'ml' ? 'мл' : 'г'} ${food}`,
      repeat: 'В этом челлендже были пропуски в записях. Стоит повторить, когда будет удобно.',
      baselineTitle: 'Оценка симптомов, самооценка',
      baselineNote: 'Та же шкала 0–10, что вы отмечаете каждый вечер.',
      weekLabel: (n) => `неделя ${n}`,
      pendingNote: 'Группы появляются здесь по мере закрытия челленджей.',
      docButton: 'Сводка для врача',
      docClose: 'Закрыть',
      nextTitle: 'Следующий протокол',
      nextName: { sleep: 'Сон', bp: 'Давление' },
      nextWhy: {
        sleep:
          'Энергия отмечена как низкая в 31 вечер из 51, включая дни без всякой реакции. Это за пределами того, что проверяет текущий протокол.',
      },
      nextStart: 'Посмотреть, что в нём',
      doc: {
        title: 'Сводка по протоколу',
        subtitle: 'Составлено участником по собственным записям',
        fields: {
          case: 'Запись',
          protocol: 'Протокол',
          protocolValue: 'Структурированная реинтродукция, пять групп, по три дня',
          dates: 'Даты',
          logged: 'Записано вечеров',
          scale: 'Измерение',
          scaleValue: 'Самооценка симптомов, 0–10, каждый вечер',
        },
        tableTitle: 'Результаты челленджей',
        cols: { group: 'Группа', days: 'Дни', result: 'Результат' },
        loadTitle: 'Оценка симптомов',
        loadRow: (a, b, w) => `Неделя 1: ${a} · Неделя ${w}: ${b}`,
        footer:
          'Наблюдения записаны участником. Не диагноз и не рекомендация по лечению. Количества относятся к разовым порциям, проверенным в последовательные дни.',
      },
    },

    redFlag: {
      eyebrow: 'Протокол остановлен',
      title: 'Это не то, что мы читаем',
      logged: (when) => `Вы отметили кровь в стуле — ${when}.`,
      body:
        'Threshold не интерпретирует этот симптом и не продолжает протокол после него. Очередь остановлена там, где стояла.',
      actionTitle: 'Что делать сейчас',
      actions: [
        'Обратитесь к врачу. В тот же день, если кровотечение обильное или есть жар, слабость либо сильная боль.',
        'Возьмите с собой записи — вечерние отметки и результаты челленджей выгружаются одной страницей.',
      ],
      exportButton: 'Выгрузить записи',
      careButton: 'Найти, куда обратиться',
      lockNote: 'Протокол остаётся остановленным, пока вы не отметите, что были у врача. Кнопки «продолжить» здесь нет.',
    },

    presenter: {
      label: 'Докладчик',
      screens: 'Экран',
      week: 'Неделя',
      reset: 'Сброс',
      hide: 'Скрыть',
      hideHint: 'H — скрыть панель',
      showHint: 'Нажмите H для панели докладчика',
      redFlagBtn: 'Красный флаг',
      order: 'Порядок показа: чек → сегодня → связи → карта',
    },
  },
}
