import { useEffect, useRef, useState } from 'react'
import { Send, ArrowRight } from 'lucide-react'
import { Screen, Eyebrow, Card, ThresholdRule, StatusMark, STATUS_COLOR, Stagger } from '../components/bits.jsx'
import { ASK } from '../data.js'

// Шестой экран отвечает на вопрос «зачем платить после восьмой недели».
// Ответ собирается из строк карты этого человека: порог, источник порога и
// оценка количества в блюде. Ни общей таблицы продуктов, ни поиска.
const THINK_MS = 1100

export default function AskThreshold({ t, state }) {
  const [stage, setStage] = useState('idle') // idle | thinking | answer
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const done = state.queue.filter((q) => q.status === 'done').length
  const ready = state.map.rows.every((r) => r.status !== 'pending' && r.status !== 'testing')

  if (!ready) {
    return (
      <Screen>
        <Eyebrow>{t.ask.eyebrow}</Eyebrow>
        <h1 className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">{t.ask.emptyTitle}</h1>
        <div className="mt-5">
          <ThresholdRule />
        </div>
        <Card className="mt-5 px-5 py-6">
          <p className="font-mono text-[38px] leading-none text-bone">
            {done}
            <span className="text-[16px] text-faint"> / {state.queue.length}</span>
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-dim">
            {t.ask.emptyBody(done, state.queue.length)}
          </p>
        </Card>
      </Screen>
    )
  }

  const ask = () => {
    setStage('thinking')
    timer.current = setTimeout(() => setStage('answer'), THINK_MS)
  }

  return (
    <Screen>
      <Eyebrow>{t.ask.eyebrow}</Eyebrow>
      <h1 className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">{t.ask.title}</h1>
      <div className="mt-5">
        <ThresholdRule />
      </div>

      {stage === 'idle' ? (
        <>
          <Card className="mt-5 px-5 py-5">
            <p className="text-[13px] text-dim">{t.ask.hint}</p>
            <button
              onClick={ask}
              className="mt-4 flex w-full items-center gap-3 rounded-xl border border-white/12 px-4 py-3 text-left"
            >
              <span className="flex-1 text-[14px] text-bone/70">{t.ask.placeholder}</span>
              <Send size={15} strokeWidth={1.8} className="text-marigold" />
            </button>
          </Card>
        </>
      ) : (
        <>
          <div className="mt-5 flex justify-end">
            <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-raised px-4 py-2.5 text-[14px] text-bone">
              {t.ask.question}
            </p>
          </div>

          {stage === 'thinking' && (
            <p className="eyebrow mt-4 animate-blip text-marigold">{t.ask.thinking}</p>
          )}

          {stage === 'answer' && (
            <div className="mt-5">
              <ul className="space-y-px overflow-hidden rounded-2xl border border-white/[0.06]">
                {ASK.lines.map((line, i) => {
                  const row = state.map.rows.find((r) => r.id === line.group)
                  const src = state.queue.find((q) => q.id === line.source)
                  return (
                    <Stagger key={line.group} index={i}>
                      <li className="bg-surface px-4 py-4">
                        <div className="flex items-center gap-3">
                          <StatusMark status={row.status} />
                          <span className="flex-1 text-[15px] text-bone">{t.groupsShort[line.group]}</span>
                          <span className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] ${
                            line.verdict === 'over' ? 'text-plum' : line.verdict === 'under' ? 'text-marigold' : 'text-celadon'
                          }`}>
                            {t.ask.verdicts[line.verdict]}
                          </span>
                        </div>

                        <dl className="mt-3 space-y-1.5 pl-[21px]">
                          <Row k={t.ask.yourLine} v={lineLabel(t, line, row)} accent={line.verdict === 'under'} />
                          <Row
                            k={t.ask.inDish}
                            v={`${line.inDish.amount} ${t.meal.units[line.inDish.unit]}`}
                          />
                        </dl>

                        <p className="mt-2 pl-[21px] font-mono text-[10px] uppercase tracking-[0.08em] text-faint">
                          {t.ask.sourceLine(src.days)}
                        </p>
                      </li>
                    </Stagger>
                  )
                })}
              </ul>

              <Card className="mt-4 px-5 py-5">
                <Eyebrow tone="marigold">{t.ask.verdictTitle}</Eyebrow>
                <p className="mt-2 text-[14px] leading-relaxed text-bone/90">{t.ask.verdict}</p>
                <p className="mt-3 flex items-start gap-2 border-t border-white/[0.06] pt-3 text-[13px] leading-relaxed text-celadon">
                  <ArrowRight size={14} strokeWidth={2} className="mt-[3px] shrink-0" />
                  {t.ask.swap}
                </p>
              </Card>

              <p className="mt-3 text-[11px] leading-relaxed text-faint">{t.ask.disclaimer}</p>
            </div>
          )}
        </>
      )}
    </Screen>
  )
}

// Порог берётся из строки карты, а не из текста: если карта изменится,
// изменится и ответ.
function lineLabel(t, line, row) {
  const f = t.ask.lineFor[line.group]
  if (typeof f === 'function') return f(row.amount, t.meal.units[row.unit])
  return f
}

function Row({ k, v, accent }) {
  return (
    <div className="flex gap-3">
      <dt className="w-[104px] shrink-0 text-[12px] text-faint">{k}</dt>
      <dd className={`flex-1 text-[13px] ${accent ? 'text-marigold' : 'text-bone/85'}`}>{v}</dd>
    </div>
  )
}
