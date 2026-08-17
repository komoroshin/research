import { useEffect, useRef, useState } from 'react'
import { Mic, Check, Square, Camera, ChevronRight } from 'lucide-react'
import { Screen, Eyebrow, Card, ThresholdRule, Stagger } from '../components/bits.jsx'

// Scripted playback only. Nothing is recorded, nothing is recognised.
const LISTEN_MS = 2400
const WORD_MS = 55

export default function EveningCheck({ t, state, lang, onOpenMeal }) {
  const [stage, setStage] = useState('idle') // idle | listening | transcript | parsed | saved
  const [seconds, setSeconds] = useState(0)
  const [words, setWords] = useState(0)
  const timers = useRef([])

  const transcript = t.check.transcripts[state.check.variant]
  const allWords = transcript.split(' ')

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current.forEach(clearInterval)
    timers.current = []
  }
  useEffect(() => clear, [])

  const start = () => {
    clear()
    setStage('listening')
    setSeconds(0)
    setWords(0)
    const tick = setInterval(() => setSeconds((s) => s + 1), 1000)
    timers.current.push(tick)
    timers.current.push(
      setTimeout(() => {
        clearInterval(tick)
        setStage('transcript')
        let i = 0
        const type = setInterval(() => {
          i += 1
          setWords(i)
          if (i >= allWords.length) {
            clearInterval(type)
            timers.current.push(setTimeout(() => setStage('parsed'), 450))
          }
        }, WORD_MS)
        timers.current.push(type)
      }, LISTEN_MS)
    )
  }

  const restart = () => {
    clear()
    setStage('idle')
    setSeconds(0)
    setWords(0)
  }

  return (
    <Screen>
      <Eyebrow>
        {t.check.eyebrow} · {t.check.duration}
      </Eyebrow>
      <h1 className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">
        {t.check.title}
      </h1>

      <div className="mt-5">
        <ThresholdRule />
      </div>

      {/* Capture */}
      <Card className="mt-5 px-5 py-6">
        {stage === 'idle' ? (
          <button onClick={start} className="flex w-full flex-col items-center gap-4">
            <span className="relative flex h-[86px] w-[86px] items-center justify-center rounded-full bg-marigold text-ink transition hover:brightness-105">
              <span className="absolute inset-0 rounded-full bg-marigold/25 blur-xl" aria-hidden />
              <Mic size={30} strokeWidth={1.8} className="relative" />
            </span>
            <span className="text-[13px] text-dim">{t.check.idleHint}</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={restart}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-marigold/40 text-marigold"
                aria-label={t.check.again}
              >
                <Square size={14} strokeWidth={2} fill="currentColor" />
              </button>
              <div className="wave" aria-hidden>
                {BARS.map((h, i) => (
                  <i
                    key={i}
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 60}ms`,
                      opacity: stage === 'listening' ? 1 : 0.25,
                      animationPlayState: stage === 'listening' ? 'running' : 'paused',
                    }}
                  />
                ))}
              </div>
              <span className="w-10 font-mono text-[13px] text-bone">0:{String(seconds).padStart(2, '0')}</span>
            </div>
            <p className="eyebrow text-marigold">
              {stage === 'listening'
                ? t.check.listening
                : stage === 'transcript'
                ? t.check.transcribing
                : t.check.parsing}
            </p>
          </div>
        )}
      </Card>

      {/* Второй вход с главного экрана: съёмка еды случается несколько раз в
          день, вечерний чек — один. */}
      {stage === 'idle' && (
        <button
          onClick={onOpenMeal}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-surface px-4 py-3.5 text-left transition hover:bg-raised"
        >
          <Camera size={17} strokeWidth={1.7} className="shrink-0 text-marigold" />
          <span className="flex-1 text-[14px] text-bone">{t.meal.cameraCta}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-faint">
            {t.meal.cameraCtaNote}
          </span>
          <ChevronRight size={15} strokeWidth={1.8} className="text-faint" />
        </button>
      )}

      {/* Transcript */}
      {stage !== 'idle' && stage !== 'listening' && (
        <div className="mt-5 animate-rise">
          <Eyebrow>{t.check.transcriptLabel}</Eyebrow>
          <p className="mt-2 text-[15px] leading-[1.5] text-bone/85">
            {allWords.slice(0, words).join(' ')}
            {words < allWords.length && (
              <span className="ml-0.5 inline-block h-[15px] w-[7px] translate-y-[2px] bg-marigold" />
            )}
          </p>
        </div>
      )}

      {/* Parsed fields — the moment the demo is built around */}
      {(stage === 'parsed' || stage === 'saved') && (
        <div className="mt-6">
          <Eyebrow tone="marigold">{t.check.fieldsLabel}</Eyebrow>
          <Card className="mt-2 divide-y divide-white/[0.05]">
            {state.check.fields.map((f, i) => (
              <Stagger key={f.id} index={i}>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-[14px] text-dim">{t.check.fields[f.id]}</span>
                  <span className="flex items-baseline gap-2">
                    <span className="text-[14px] text-bone">{t.check.levels[f.level]}</span>
                    {f.value !== null && (
                      <span className="font-mono text-[12px] text-faint">{f.value}/10</span>
                    )}
                  </span>
                </div>
              </Stagger>
            ))}
          </Card>
          <p className="mt-2 text-[11px] leading-relaxed text-faint">{t.check.scaleNote}</p>

          {stage === 'parsed' ? (
            <button
              onClick={() => setStage('saved')}
              className="mt-5 w-full rounded-xl bg-bone py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition hover:brightness-95"
              style={{ animationDelay: '520ms' }}
            >
              {t.check.confirm}
            </button>
          ) : (
            <div className="mt-5 animate-rise rounded-xl border border-celadon/25 bg-celadon/[0.07] px-4 py-4">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-celadon">
                <Check size={13} strokeWidth={2.2} />
                {t.check.savedTitle}
              </p>
              <p className="mt-1.5 text-[14px] text-bone">
                {t.check.savedNote[state.check.variant]}
              </p>
              <p className="mt-1 text-[12px] text-faint">{t.check.streak(state.check.streak)}</p>
            </div>
          )}
        </div>
      )}
    </Screen>
  )
}

const BARS = [30, 55, 80, 45, 95, 60, 35, 70, 100, 50, 75, 40, 85, 55, 30, 65, 90, 45, 60, 35]
