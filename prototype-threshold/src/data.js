// ---------------------------------------------------------------------------
// Scenario data for the Threshold prototype.
//
// One fictional person, eight weeks, four challenge outcomes: tolerated,
// reacts, threshold, undetermined. Numbers here are the single source of
// truth — screen 3 (signals) and screen 4 (map) both read from this file, so
// they cannot drift apart. All wording lives in content.js.
//
// No real patient data. Nothing here is measured; it is a written scenario.
// ---------------------------------------------------------------------------

export const CASE = {
  code: 'TH-0412',
  startDate: { en: 'Mar 3', ru: '3 марта' },
  dateRange: { en: 'Mar 3 – Apr 27', ru: '3 марта — 27 апреля' },
  symptomScaleMax: 10,
  // The line above which a day counts as a reaction day. This is the marigold
  // hairline that appears on every screen.
  reactionLine: 4,
}

export const GROUP_IDS = ['sorbitol', 'fructans', 'lactose', 'gos', 'fructose']

// Outcome vocabulary, deliberately non-diagnostic:
//   tolerated    — no reaction observed across the challenge
//   reacts       — reaction observed at every step
//   threshold    — reaction observed above a specific amount
//   undetermined — not enough clean data to say
//   testing / queued / pending
export const WEEKS = {
  1: {
    id: 1,
    phase: 'elimination',
    protocolDay: 6,
    protocolDayTotal: 56,
    phaseDay: 6,
    phaseDayTotal: 14,
    check: {
      variant: 'w1',
      streak: 6,
      fields: [
        { id: 'bloating', level: 'moderate', value: 5 },
        { id: 'pain', level: 'none', value: 0 },
        { id: 'stool', level: 'normal', value: null },
        { id: 'energy', level: 'low', value: 3 },
      ],
    },
    challenge: null,
    nextChallengeInDays: 8,
    queue: [
      { id: 'sorbitol', status: 'queued', order: 1 },
      { id: 'fructans', status: 'queued', order: 2 },
      { id: 'lactose', status: 'queued', order: 3 },
      { id: 'gos', status: 'queued', order: 4 },
      { id: 'fructose', status: 'queued', order: 5 },
    ],
    signals: { enough: false, daysLogged: 6, daysNeeded: 14 },
    map: {
      rows: GROUP_IDS.map((id) => ({ id, status: 'pending' })),
      baseline: 6.8,
      current: 6.4,
      currentLabel: 'w1',
    },
    next: null,
  },

  4: {
    id: 4,
    phase: 'reintroduction',
    protocolDay: 24,
    protocolDayTotal: 56,
    check: {
      variant: 'w4',
      streak: 24,
      fields: [
        { id: 'bloating', level: 'moderate', value: 5 },
        { id: 'pain', level: 'none', value: 0 },
        { id: 'stool', level: 'normal', value: null },
        { id: 'energy', level: 'low', value: 3 },
      ],
    },
    challenge: {
      group: 'lactose',
      day: 2,
      of: 3,
      // Escalating ladder. Day 3 is where this person's reaction appears.
      ladder: [
        { day: 1, amount: 60, unit: 'ml', food: 'milk', state: 'done', reaction: 'none' },
        { day: 2, amount: 125, unit: 'ml', food: 'milk', state: 'today', reaction: null },
        { day: 3, amount: 250, unit: 'ml', food: 'milk', state: 'ahead', reaction: null },
      ],
      options: [
        { food: 'milk', amount: 125, unit: 'ml' },
        { food: 'yogurt', amount: 100, unit: 'g' },
      ],
      washoutDays: 3,
    },
    queue: [
      { id: 'sorbitol', status: 'done', outcome: 'tolerated', order: 1, days: 'day 8–10' },
      { id: 'fructans', status: 'done', outcome: 'reacts', order: 2, days: 'day 14–16' },
      { id: 'lactose', status: 'testing', order: 3, days: 'day 23–25' },
      { id: 'gos', status: 'queued', order: 4, days: 'day 32' },
      { id: 'fructose', status: 'queued', order: 5, days: 'day 38' },
    ],
    signals: {
      enough: true,
      primary: {
        group: 'fructans',
        symptom: 'bloating',
        lagHours: 5,
        hits: 7,
        of: 9,
      },
      counter: { group: 'sorbitol', hits: 1, of: 8 },
      // 14-day window. exposure = wheat eaten that day; the evening score is
      // recorded the same night, ~5 h after the meal.
      // Invariant: 9 exposure days, 7 of them above the reaction line (4.0),
      // and no non-exposure day above it. Checked by `npm run check`.
      series: [
        { day: 1, load: 2.1, exposure: null },
        { day: 2, load: 5.9, exposure: 0.7 },
        { day: 3, load: 6.4, exposure: 0.7 },
        { day: 4, load: 2.4, exposure: null },
        { day: 5, load: 5.6, exposure: 0.7 },
        { day: 6, load: 2.8, exposure: 0.7 },
        { day: 7, load: 2.2, exposure: null },
        { day: 8, load: 6.8, exposure: 0.7 },
        { day: 9, load: 5.2, exposure: 0.7 },
        { day: 10, load: 2.6, exposure: null },
        { day: 11, load: 6.1, exposure: 0.7 },
        { day: 12, load: 3.1, exposure: 0.7 },
        { day: 13, load: 2.3, exposure: null },
        { day: 14, load: 5.8, exposure: 0.7 },
      ],
    },
    map: {
      rows: [
        { id: 'sorbitol', status: 'tolerated' },
        { id: 'fructans', status: 'reacts' },
        { id: 'lactose', status: 'testing' },
        { id: 'gos', status: 'pending' },
        { id: 'fructose', status: 'pending' },
      ],
      baseline: 6.8,
      current: 3.6,
      currentLabel: 'w4',
    },
    next: null,
  },

  8: {
    id: 8,
    phase: 'complete',
    protocolDay: 54,
    protocolDayTotal: 56,
    check: {
      variant: 'w8',
      streak: 51,
      fields: [
        { id: 'bloating', level: 'mild', value: 2 },
        { id: 'pain', level: 'none', value: 0 },
        { id: 'stool', level: 'normal', value: null },
        { id: 'energy', level: 'low', value: 3 },
      ],
    },
    challenge: null,
    queue: [
      { id: 'sorbitol', status: 'done', outcome: 'tolerated', order: 1, days: 'day 8–10' },
      { id: 'fructans', status: 'done', outcome: 'reacts', order: 2, days: 'day 14–16' },
      { id: 'lactose', status: 'done', outcome: 'threshold', order: 3, days: 'day 23–25' },
      { id: 'gos', status: 'done', outcome: 'tolerated', order: 4, days: 'day 32–34' },
      { id: 'fructose', status: 'done', outcome: 'undetermined', order: 5, days: 'day 38–40' },
    ],
    signals: {
      enough: true,
      primary: { group: 'fructans', symptom: 'bloating', lagHours: 5, hits: 7, of: 9 },
      counter: { group: 'sorbitol', hits: 1, of: 8 },
      // 14-day window. exposure = wheat eaten that day; the evening score is
      // recorded the same night, ~5 h after the meal.
      // Invariant: 9 exposure days, 7 of them above the reaction line (4.0),
      // and no non-exposure day above it. Checked by `npm run check`.
      series: [
        { day: 1, load: 2.1, exposure: null },
        { day: 2, load: 5.9, exposure: 0.7 },
        { day: 3, load: 6.4, exposure: 0.7 },
        { day: 4, load: 2.4, exposure: null },
        { day: 5, load: 5.6, exposure: 0.7 },
        { day: 6, load: 2.8, exposure: 0.7 },
        { day: 7, load: 2.2, exposure: null },
        { day: 8, load: 6.8, exposure: 0.7 },
        { day: 9, load: 5.2, exposure: 0.7 },
        { day: 10, load: 2.6, exposure: null },
        { day: 11, load: 6.1, exposure: 0.7 },
        { day: 12, load: 3.1, exposure: 0.7 },
        { day: 13, load: 2.3, exposure: null },
        { day: 14, load: 5.8, exposure: 0.7 },
      ],
    },
    map: {
      rows: [
        { id: 'lactose', status: 'threshold', amount: 125, unit: 'ml', food: 'milk', alt: { amount: 100, unit: 'g', food: 'yogurt' }, failAt: 250 },
        { id: 'fructans', status: 'reacts' },
        { id: 'sorbitol', status: 'tolerated' },
        { id: 'gos', status: 'tolerated' },
        { id: 'fructose', status: 'undetermined' },
      ],
      baseline: 6.8,
      current: 2.9,
      currentLabel: 'w8',
    },
    next: { protocol: 'sleep' },
  },
}

// The alarm-symptom screen. Reached from the presenter panel only.
export const RED_FLAG = { trigger: 'blood', loggedOn: { en: 'today, 21:04', ru: 'сегодня, 21:04' } }
