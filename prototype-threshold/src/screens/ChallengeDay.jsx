import { ArrowRight } from 'lucide-react'
import { Screen, Eyebrow, Card, ThresholdRule, StatusMark, STATUS_COLOR } from '../components/bits.jsx'
import Assistant from '../components/Assistant.jsx'
import { ASSISTANT } from '../data.js'

export default function ChallengeDay({ t, state, onOpenMap }) {
  const c = state.challenge
  const maxAmount = c ? Math.max(...c.ladder.map((r) => r.amount)) : 1

  return (
    <Screen>
      {c ? (
        <>
          <Eyebrow tone="marigold">{t.today.eyebrowChallenge}</Eyebrow>
          <h1 className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">
            {t.today.challengeTitle(t.groups[c.group])}
          </h1>
          <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.14em] text-marigold">
            {t.today.dayOf(c.day, c.of)}
          </p>

          <div className="mt-5">
            <ThresholdRule />
          </div>

          {/* Today's amount */}
          <Card className="mt-4 px-5 py-4">
            <Eyebrow>{t.today.todayDose}</Eyebrow>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-[42px] leading-none tracking-[-0.02em] text-bone">
                {c.options[0].amount}
              </span>
              <span className="font-mono text-[18px] text-dim">{t.units[c.options[0].unit]}</span>
              <span className="text-[17px] text-bone/80">{t.foods[c.options[0].food]}</span>
            </p>
            <p className="mt-2 text-[13px] text-dim">
              {t.today.or}{' '}
              <span className="text-bone/80">
                {c.options[1].amount} {t.units[c.options[1].unit]} {t.foods[c.options[1].food]}
              </span>
            </p>
            <p className="mt-4 border-t border-white/[0.06] pt-3 text-[12px] leading-relaxed text-faint">
              {t.today.singleFood}
            </p>
          </Card>

          {/* Dose ladder */}
          <div className="mt-5">
            <Eyebrow>{t.today.ladderLabel}</Eyebrow>
            <div className="mt-3 space-y-2.5">
              {c.ladder.map((r) => {
                const w = Math.max(14, Math.round((r.amount / maxAmount) * 100))
                const active = r.state === 'today'
                return (
                  <div key={r.day} className="flex items-center gap-3">
                    <span
                      className={`w-6 font-mono text-[11px] ${active ? 'text-marigold' : 'text-faint'}`}
                    >
                      {r.day}
                    </span>
                    <div className="relative h-8 flex-1">
                      <div
                        className={`h-full rounded-md ${
                          r.state === 'done'
                            ? 'bg-celadon/20'
                            : active
                            ? 'bg-marigold/25 ring-1 ring-marigold'
                            : 'border border-dashed border-white/10'
                        }`}
                        style={{ width: `${w}%` }}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-bone">
                        {r.amount} {t.units[r.unit]}
                      </span>
                    </div>
                    <span
                      className={`w-[70px] shrink-0 text-right font-mono text-[9px] uppercase leading-tight tracking-[0.08em] ${
                        r.state === 'done'
                          ? 'text-celadon'
                          : active
                          ? 'text-marigold'
                          : 'text-faint'
                      }`}
                    >
                      {r.state === 'done' ? t.today.noReaction : t.today.ladderStates[r.state]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

        </>
      ) : state.phase === 'elimination' ? (
        <>
          <Eyebrow tone="marigold">{t.phase.elimination}</Eyebrow>
          <h1 className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">
            {t.today.eliminationTitle}
          </h1>
          <div className="mt-5">
            <ThresholdRule />
          </div>
          <Card className="mt-5 px-5 py-5">
            <p className="font-mono text-[38px] leading-none text-bone">
              {state.phaseDay}
              <span className="text-[16px] text-faint"> / {state.phaseDayTotal}</span>
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-dim">
              {t.today.eliminationBody(state.phaseDay, state.phaseDayTotal)}
            </p>
            <p className="mt-4 border-t border-white/[0.06] pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-marigold">
              {t.today.firstChallengeIn(state.nextChallengeInDays)}
            </p>
          </Card>
        </>
      ) : (
        <>
          <Eyebrow tone="marigold">{t.phase.complete}</Eyebrow>
          <h1 className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">
            {t.today.completeTitle}
          </h1>
          <div className="mt-5">
            <ThresholdRule />
          </div>
          <Card className="mt-5 px-5 py-5">
            <p className="text-[13px] leading-relaxed text-dim">{t.today.completeBody}</p>
            <button
              onClick={onOpenMap}
              className="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-marigold"
            >
              {t.today.openMap} <ArrowRight size={13} strokeWidth={2} />
            </button>
          </Card>
        </>
      )}

      {/* The queue: the element that separates this from a diary */}
      <div className="mt-6">
        <Eyebrow>{t.today.queueTitle}</Eyebrow>
        <ol className="mt-3 space-y-px overflow-hidden rounded-2xl border border-white/[0.06]">
          {state.queue.map((q) => {
            const status = q.status === 'done' ? q.outcome : q.status
            return (
              <li
                key={q.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  q.status === 'testing' ? 'bg-marigold/[0.08]' : 'bg-surface'
                }`}
              >
                <span className="w-4 font-mono text-[11px] text-faint">{q.order}</span>
                <StatusMark status={status} />
                <span
                  className={`flex-1 text-[14px] ${
                    q.status === 'queued' ? 'text-dim' : 'text-bone'
                  }`}
                >
                  {t.groups[q.id]}
                </span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${STATUS_COLOR[status]}`}>
                  {t.outcomes[status]}
                </span>
              </li>
            )
          })}
        </ol>
        {state.challenge && (
          <p className="mt-3 text-[12px] text-faint">{t.today.washout(state.challenge.washoutDays)}</p>
        )}
        <p className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[12px] leading-relaxed text-dim">
          {t.today.ruleLine}
        </p>
        {c && (
          <button className="mt-4 w-full rounded-xl bg-bone py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition hover:brightness-95">
            {t.today.logDay}
          </button>
        )}
        <Assistant t={t} id={ASSISTANT.today.id} tone={ASSISTANT.today.tone} />
      </div>
    </Screen>
  )
}
