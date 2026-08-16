// Consistency check for the scenario. The demo's credibility rests on the
// numbers on screen 3 agreeing with the map on screen 4, and on both agreeing
// with what is actually drawn. Run with: npm run check
import { WEEKS, CASE } from './src/data.js'
import { CONTENT } from './src/content.js'

let failed = 0
const ok = (cond, msg) => {
  console.log(`${cond ? '  ok  ' : ' FAIL '} ${msg}`)
  if (!cond) failed++
}

for (const [wk, s] of Object.entries(WEEKS)) {
  const label = `week ${wk}`

  // 1. Queue and map describe the same five groups with the same outcomes.
  const queueOutcome = Object.fromEntries(
    s.queue.map((q) => [q.id, q.status === 'done' ? q.outcome : q.status])
  )
  const mapOutcome = Object.fromEntries(s.map.rows.map((r) => [r.id, r.status]))
  ok(
    Object.keys(queueOutcome).length === 5 && Object.keys(mapOutcome).length === 5,
    `${label}: five groups in both queue and map`
  )
  for (const id of Object.keys(queueOutcome)) {
    const q = queueOutcome[id]
    const m = mapOutcome[id]
    const same = q === m || (q === 'queued' && m === 'pending')
    ok(same, `${label}: ${id} — queue "${q}" matches map "${m}"`)
  }

  // 2. The chart must contain exactly as many exposure marks as the copy claims,
  //    and exactly as many of them above the reaction line.
  if (s.signals.enough) {
    const series = s.signals.series
    const exposures = series.filter((d) => d.exposure !== null)
    const above = exposures.filter((d) => d.load > CASE.reactionLine)
    const cleanDays = series.filter((d) => d.exposure === null)
    ok(
      exposures.length === s.signals.primary.of,
      `${label}: ${exposures.length} exposure marks drawn = "of ${s.signals.primary.of}" in the copy`
    )
    ok(
      above.length === s.signals.primary.hits,
      `${label}: ${above.length} exposures above the reaction line = "${s.signals.primary.hits} of" in the copy`
    )
    ok(
      cleanDays.every((d) => d.load <= CASE.reactionLine),
      `${label}: no day without exposure sits above the reaction line`
    )

    // 3. The association and the counter-example must match their map rows.
    ok(mapOutcome[s.signals.primary.group] === 'reacts',
      `${label}: primary signal group "${s.signals.primary.group}" is "reacts" on the map`)
    ok(mapOutcome[s.signals.counter.group] === 'tolerated',
      `${label}: counter-example group "${s.signals.counter.group}" is "tolerated" on the map`)
    ok(s.signals.counter.hits < s.signals.counter.of / 2,
      `${label}: counter-example stays a minority of its exposures`)
  }

  // 4. The challenge on screen 2 must sit inside the day range printed in the
  //    queue, and its ladder must match the threshold the map reports.
  if (s.challenge) {
    const row = s.queue.find((q) => q.id === s.challenge.group)
    const [from, to] = row.days.replace('day ', '').split('–').map(Number)
    const day = from + s.challenge.day - 1
    ok(day === s.protocolDay, `${label}: protocol day ${s.protocolDay} = day ${s.challenge.day} of ${row.days}`)
    ok(to - from + 1 === s.challenge.of, `${label}: ${row.days} spans ${s.challenge.of} days`)
  }
  const lactose = s.map.rows.find((r) => r.id === 'lactose')
  if (lactose && lactose.status === 'threshold') {
    const ladder = WEEKS[4].challenge.ladder
    ok(ladder.some((r) => r.amount === lactose.amount),
      `${label}: tolerated amount ${lactose.amount} ${lactose.unit} is a rung on the dose ladder`)
    ok(ladder[ladder.length - 1].amount === lactose.failAt,
      `${label}: reaction amount ${lactose.failAt} is the top rung of the ladder`)
  }

  // 5. Evenings logged cannot exceed days elapsed.
  ok(s.check.streak <= s.protocolDay, `${label}: ${s.check.streak} evenings logged ≤ day ${s.protocolDay}`)

  // 6. Symptom load only ever falls, and stays on the 0–10 scale.
  ok(s.map.current <= s.map.baseline && s.map.baseline <= CASE.symptomScaleMax,
    `${label}: symptom load ${s.map.baseline} → ${s.map.current} on a 0–${CASE.symptomScaleMax} scale`)
}

// 7. Every group and outcome code has words in both languages.
for (const lang of ['en', 'ru']) {
  const c = CONTENT[lang]
  for (const id of Object.keys(WEEKS[8].map.rows.map((r) => r.id).reduce((a, id) => ((a[id] = 1), a), {}))) {
    ok(Boolean(c.groups[id]), `${lang}: group "${id}" is translated`)
  }
  for (const code of ['tolerated', 'reacts', 'threshold', 'undetermined', 'testing', 'queued', 'pending']) {
    ok(Boolean(c.outcomes[code]), `${lang}: outcome "${code}" is translated`)
  }
}

console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed')
process.exit(failed ? 1 : 0)
