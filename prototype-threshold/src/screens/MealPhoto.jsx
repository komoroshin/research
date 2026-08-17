import { useEffect, useRef, useState } from 'react'
import { Camera, X, Plus, Check } from 'lucide-react'
import { Screen, Eyebrow, Card, ThresholdRule, StatusMark, STATUS_COLOR, Stagger } from '../components/bits.jsx'
import Assistant from '../components/Assistant.jsx'
import { MEAL, ASSISTANT } from '../data.js'

// Ничего не снимается и не распознаётся: фотография нарисована кодом, разбор
// проигрывается по таймеру. Пошаговое появление — блюдо, затем ингредиенты,
// затем группы — и есть то, ради чего экран сделан.
const ANALYZE_MS = 1500
const STEP_MS = 420

export default function MealPhoto({ t, state }) {
  const [stage, setStage] = useState('idle') // idle | analyzing | dish | items | groups
  const [items, setItems] = useState(MEAL.ingredients)
  const [removed, setRemoved] = useState(null)
  const [spareLeft, setSpareLeft] = useState(MEAL.spare)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const shoot = () => {
    setStage('analyzing')
    const t1 = setTimeout(() => setStage('dish'), ANALYZE_MS)
    const t2 = setTimeout(() => setStage('items'), ANALYZE_MS + STEP_MS)
    const t3 = setTimeout(() => setStage('groups'), ANALYZE_MS + STEP_MS + items.length * 110 + 320)
    timers.current.push(t1, t2, t3)
  }

  const drop = (id) => {
    const gone = items.find((i) => i.id === id)
    setRemoved(gone)
    setItems(items.filter((i) => i.id !== id))
  }
  const undo = () => {
    if (!removed) return
    setItems(MEAL.ingredients.filter((i) => items.some((x) => x.id === i.id) || i.id === removed.id))
    setRemoved(null)
  }
  const addSpare = () => {
    if (!spareLeft.length) return
    setItems([...items, spareLeft[0]])
    setSpareLeft(spareLeft.slice(1))
  }

  const showItems = stage === 'items' || stage === 'groups'
  const showGroups = stage === 'groups'

  // Итог по группам считается из того, что осталось в списке после правок.
  const totals = []
  for (const it of items) {
    if (!it.group) continue
    const row = totals.find((r) => r.group === it.group)
    if (row) row.parts.push(it)
    else totals.push({ group: it.group, parts: [it] })
  }

  return (
    <Screen>
      <Eyebrow>{t.meal.eyebrow}</Eyebrow>
      <h1 className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">{t.meal.title}</h1>
      <div className="mt-5">
        <ThresholdRule />
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="relative">
          <Plate dim={stage === 'idle'} />
          {stage === 'analyzing' && (
            <div className="absolute inset-0 flex items-end justify-center bg-ink/40 pb-4">
              <span className="eyebrow animate-blip text-marigold">{t.meal.analyzing}</span>
            </div>
          )}
          {stage === 'idle' && (
            <button
              onClick={shoot}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/55"
            >
              <span className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-marigold text-ink">
                <Camera size={28} strokeWidth={1.8} />
              </span>
              <span className="text-[13px] text-bone/80">{t.meal.idleHint}</span>
            </button>
          )}
        </div>
      </Card>

      {stage !== 'idle' && stage !== 'analyzing' && (
        <div className="mt-5 animate-rise">
          <Eyebrow>{t.meal.dishLabel}</Eyebrow>
          <p className="mt-1.5 text-[19px] text-bone">{t.meal.dish}</p>
        </div>
      )}

      {showItems && (
        <div className="mt-5">
          <Eyebrow>{t.meal.ingredientsLabel}</Eyebrow>
          <Card className="mt-2 divide-y divide-white/[0.05]">
            {items.map((it, i) => (
              <Stagger key={it.id} index={i}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="flex-1 text-[14px] text-bone">{t.meal.items[it.id]}</span>
                  <span className="font-mono text-[12px] text-dim">
                    {it.amount} {t.meal.units[it.unit]}
                  </span>
                  <span className="flex w-[104px] items-center justify-end gap-2">
                    {showGroups && it.group && (
                      <span className="flex animate-rise items-center gap-1.5">
                        <StatusMark status={groupStatus(state, it.group)} />
                        <span className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] ${STATUS_COLOR[groupStatus(state, it.group)]}`}>
                          {t.groupsShort[it.group]}
                        </span>
                      </span>
                    )}
                    {showGroups && !it.group && (
                      <span className="animate-rise font-mono text-[11px] text-faint">{t.meal.noGroup}</span>
                    )}
                  </span>
                  <button
                    onClick={() => drop(it.id)}
                    aria-label={t.meal.remove}
                    className="-mr-1 rounded-full p-1 text-faint transition hover:text-bone"
                  >
                    <X size={13} strokeWidth={1.8} />
                  </button>
                </div>
              </Stagger>
            ))}
          </Card>

          <div className="mt-2 flex items-center gap-4">
            {spareLeft.length > 0 && (
              <button onClick={addSpare} className="flex items-center gap-1.5 text-[12px] text-dim hover:text-bone">
                <Plus size={13} strokeWidth={2} /> {t.meal.add}
              </button>
            )}
            {removed && (
              <button onClick={undo} className="text-[12px] text-marigold">
                {t.meal.undo}
              </button>
            )}
          </div>
        </div>
      )}

      {showGroups && (
        <div className="mt-6 animate-rise">
          <Eyebrow tone="marigold">{t.meal.groupsLabel}</Eyebrow>
          <ul className="mt-2 space-y-px overflow-hidden rounded-2xl border border-white/[0.06]">
            {totals.map((row) => (
              <li key={row.group} className="flex items-center gap-3 bg-surface px-4 py-3">
                <StatusMark status={groupStatus(state, row.group)} />
                <span className="flex-1 text-[14px] text-bone">{t.groups[row.group]}</span>
                <span className="font-mono text-[12px] text-dim">
                  {row.parts.map((p) => `${p.amount} ${t.meal.units[p.unit]}`).join(' + ')}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-3 flex items-center gap-2 text-[12px] text-celadon">
            <Check size={13} strokeWidth={2.2} />
            {t.meal.savedLine(state.protocolDay, state.protocolDayTotal)}
          </p>

          <Assistant t={t} id={ASSISTANT.meal.id} tone={ASSISTANT.meal.tone} />
        </div>
      )}
    </Screen>
  )
}

function groupStatus(state, group) {
  const row = state.map.rows.find((r) => r.id === group)
  return row ? row.status : 'pending'
}

// Фотография нарисована кодом: стоковых снимков нет, людей и брендов нет.
function Plate({ dim }) {
  return (
    <svg viewBox="0 0 390 240" className={`block w-full ${dim ? 'opacity-70' : ''}`} role="img">
      <rect width="390" height="240" fill="#16332C" />
      <g opacity="0.5">
        <rect x="0" y="150" width="390" height="90" fill="#12292A" />
      </g>
      <ellipse cx="195" cy="126" rx="118" ry="86" fill="#E8E2D4" />
      <ellipse cx="195" cy="126" rx="96" ry="68" fill="#DED7C6" />
      {/* паста */}
      <g stroke="#E9A93C" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.95">
        <path d="M120 118c22-20 60-24 84-8s44 10 62-6" />
        <path d="M118 134c26-8 50 8 78 6s44-14 66-4" />
        <path d="M126 150c24 6 48-6 74 0s46 8 62-8" />
      </g>
      {/* грибы */}
      <g fill="#5C4A38">
        <ellipse cx="158" cy="120" rx="15" ry="9" />
        <ellipse cx="232" cy="140" rx="13" ry="8" />
        <ellipse cx="196" cy="104" rx="11" ry="7" />
      </g>
      {/* зелень */}
      <g fill="#74B49B">
        <circle cx="145" cy="146" r="4" />
        <circle cx="214" cy="112" r="3.5" />
        <circle cx="243" cy="124" r="3" />
        <circle cx="176" cy="158" r="3.5" />
      </g>
      {/* соус */}
      <g fill="#F3EEE2" opacity="0.75">
        <ellipse cx="185" cy="140" rx="26" ry="12" />
        <ellipse cx="222" cy="118" rx="16" ry="8" />
      </g>
    </svg>
  )
}
