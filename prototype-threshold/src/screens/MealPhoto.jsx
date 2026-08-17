import { useEffect, useRef, useState } from 'react'
import { Camera, X, Plus, Check } from 'lucide-react'
import { Screen, Eyebrow, Card, ThresholdRule, StatusMark, STATUS_COLOR, Stagger } from '../components/bits.jsx'
import Assistant from '../components/Assistant.jsx'
import { MEAL, ASSISTANT } from '../data.js'
import mealPhoto from '../assets/meal.jpg'

// Ничего не снимается и не распознаётся: кадр подготовлен заранее, разбор
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

// Кадр подготовлен заранее и лежит в src/assets/meal.jpg. Заменить блюдо —
// положить другой файл под тем же именем; больше на экране ничего от него не
// зависит.
function Plate({ dim }) {
  return (
    <div className="relative aspect-[13/8] w-full overflow-hidden bg-raised">
      <img
        src={mealPhoto}
        alt=""
        className={`h-full w-full object-cover transition duration-300 ${
          dim ? 'scale-[1.02] blur-[1px] brightness-75' : ''
        }`}
      />
    </div>
  )
}
