import { Check, ArrowRight } from 'lucide-react'
import { Screen, Eyebrow, Card, ThresholdRule } from '../components/bits.jsx'
import { PROTOCOL } from '../data.js'

// Единственный экран, где видно, что границы фаз двигаются по ответу человека,
// а не по расписанию: закрытые фазы имеют сплошной рельс, будущие — рваный,
// и дат у них нет. Отсюда же правило выхода из элиминации.
export default function Calendar({ t, state, onOpenMap }) {
  const order = PROTOCOL.phases.map((p) => p.id)
  const currentIndex = order.indexOf(state.calendar.currentPhase)

  return (
    <Screen>
      <Eyebrow>{t.calendar.eyebrow}</Eyebrow>
      <h1 className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">
        {t.calendar.title}
      </h1>
      <div className="mt-5">
        <ThresholdRule />
      </div>

      <ol className="mt-5">
        {PROTOCOL.phases.map((phase, i) => {
          const copy = t.calendar.phases[phase.id]
          const status = i < currentIndex ? 'done' : i === currentIndex ? 'now' : 'ahead'
          const last = i === PROTOCOL.phases.length - 1
          return (
            <li key={phase.id} className="relative pl-9">
              {/* Рельс: сплошной у пройденного, сплошной оранжевый у текущего,
                  рваный у будущего — граница ещё не назначена. */}
              {!last && (
                <span
                  aria-hidden
                  className={`absolute left-[7px] top-4 bottom-0 w-px ${
                    status === 'ahead' ? 'bg-transparent' : status === 'now' ? 'bg-marigold/50' : 'bg-white/15'
                  }`}
                  style={
                    status === 'ahead'
                      ? {
                          backgroundImage:
                            'repeating-linear-gradient(180deg, rgba(255,255,255,0.16) 0 4px, transparent 4px 10px)',
                        }
                      : undefined
                  }
                />
              )}

              <span
                aria-hidden
                className={`absolute left-0 top-[6px] flex h-[15px] w-[15px] items-center justify-center rounded-[3px] ${
                  status === 'done'
                    ? 'bg-white/20 text-bone'
                    : status === 'now'
                    ? 'bg-marigold text-ink'
                    : 'border border-dashed border-white/25'
                }`}
              >
                {status === 'done' && <Check size={10} strokeWidth={3} />}
              </span>

              <div className={`pb-7 ${status === 'ahead' ? 'opacity-70' : ''}`}>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-[17px] text-bone">{copy.name}</h2>
                  {copy.duration && (
                    <span className="font-mono text-[11px] text-faint">{copy.duration}</span>
                  )}
                  <span
                    className={`ml-auto font-mono text-[9px] uppercase tracking-[0.12em] ${
                      status === 'now' ? 'text-marigold' : 'text-faint'
                    }`}
                  >
                    {t.calendar.states[status]}
                  </span>
                </div>

                <p className="mt-1.5 text-[13px] leading-relaxed text-dim">{copy.line}</p>

                {/* Отметка текущего положения стоит внутри своей фазы, а не
                    отдельным блоком: иначе неясно, к чему она относится. */}
                {status === 'now' && (
                  <div className="mt-3 rounded-xl border border-marigold/30 bg-marigold/[0.07] px-4 py-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-marigold">
                      {t.calendar.youAreHere}
                    </p>
                    <p className="mt-1 font-mono text-[15px] text-bone">
                      {t.calendar.position(state.protocolDay, PROTOCOL.totalDays)}
                    </p>
                    <p className="mt-0.5 text-[13px] text-bone/85">{stepLabel(t, state)}</p>
                  </div>
                )}

                {/* Правило выхода — самая сильная строка экрана, поэтому оно
                    стоит у своей фазы, а не в подвале. */}
                {phase.exitRule && (
                  <div className="mt-3 border-l-2 border-plum/60 pl-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-plum">
                      {t.calendar.exitRuleLabel}
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-bone/80">
                      {t.calendar.exitRule}
                    </p>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <p className="-mt-2 text-[12px] leading-relaxed text-faint">{t.calendar.forecastNote}</p>

      <Card className="mt-6 px-5 py-5">
        <Eyebrow tone="marigold">{t.calendar.endTitle}</Eyebrow>
        <ul className="mt-3 space-y-2">
          {t.calendar.endItems.map((item) => (
            <li key={item} className="flex gap-2.5 text-[13.5px] leading-snug text-bone/85">
              <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-[1px] bg-marigold" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
        <button
          onClick={onOpenMap}
          className="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-marigold"
        >
          {t.calendar.endCta} <ArrowRight size={13} strokeWidth={2} />
        </button>
      </Card>
    </Screen>
  )
}

// Текущий шаг берётся из того же состояния, что рисует экран челленджа.
function stepLabel(t, state) {
  if (state.challenge) {
    return t.calendar.stepNow(
      t.groups[state.challenge.group],
      state.challenge.day,
      state.challenge.of
    )
  }
  if (state.phase === 'complete') return t.calendar.stepDone
  return t.calendar.stepBase(state.phaseDay, state.phaseDayTotal)
}
