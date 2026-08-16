import { useState } from 'react'
import { FileText, X, ArrowRight } from 'lucide-react'
import { Screen, Eyebrow, Card, ThresholdRule, StatusMark, STATUS_COLOR } from '../components/bits.jsx'
import { CASE } from '../data.js'

export default function ToleranceMap({ t, state, lang }) {
  const [doc, setDoc] = useState(false)
  const m = state.map
  const hasPending = m.rows.some((r) => r.status === 'pending' || r.status === 'testing')

  return (
    <Screen>
      <Eyebrow>{t.map.eyebrow}</Eyebrow>
      <h1 className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">
        {t.map.title}
      </h1>
      <div className="mt-5">
        <ThresholdRule />
      </div>

      {/* Baseline vs now, in the units collected on screen 1 */}
      <Card className="mt-5 px-5 py-5">
        <Eyebrow>{t.map.baselineTitle}</Eyebrow>
        <div className="mt-3 flex items-end gap-5">
          <Reading value={m.baseline} label={t.map.weekLabel(1)} muted />
          <div className="mb-2 h-px flex-1 bg-white/10" />
          <Reading value={m.current} label={t.map.weekLabel(state.id)} />
        </div>
        <div className="mt-4 space-y-1.5">
          <Bar value={m.baseline} tone="dim" />
          <Bar value={m.current} tone="bone" />
        </div>
        <p className="mt-3 text-[11px] text-faint">{t.map.baselineNote}</p>
      </Card>

      {/* The artifact */}
      <ol className="mt-5 space-y-px overflow-hidden rounded-2xl border border-white/[0.06]">
        {m.rows.map((r) => (
          <li key={r.id} className="bg-surface px-4 py-4">
            <div className="flex items-center gap-3">
              <StatusMark status={r.status} />
              <span className="flex-1 text-[15px] text-bone">{t.groups[r.id]}</span>
              <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${STATUS_COLOR[r.status]}`}>
                {t.outcomes[r.status]}
              </span>
            </div>

            {r.status === 'threshold' && (
              <div className="mt-3 pl-[21px]">
                <p className="font-mono text-[19px] text-marigold">
                  {t.map.upTo(r.amount, r.unit, t.foods[r.food])}
                </p>
                <p className="mt-0.5 text-[12px] text-dim">
                  {t.map.altAmount(r.alt.amount, r.alt.unit, t.foods[r.alt.food])}
                </p>
                <ThresholdAxis amount={r.amount} failAt={r.failAt} unitLabel={t.units[r.unit]} />
                <p className="mt-1 text-[11px] text-plum">
                  {t.map.reactionAt(r.failAt, r.unit, t.foods[r.food])}
                </p>
              </div>
            )}

            {r.status === 'undetermined' && (
              <p className="mt-2 pl-[21px] text-[12px] leading-relaxed text-dim">{t.map.repeat}</p>
            )}
          </li>
        ))}
      </ol>
      {hasPending && <p className="mt-3 text-[11px] text-faint">{t.map.pendingNote}</p>}

      <button
        onClick={() => setDoc(true)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-bone transition hover:bg-white/[0.04]"
      >
        <FileText size={14} strokeWidth={1.8} />
        {t.map.docButton}
      </button>

      {state.next && (
        <Card className="mt-5 px-5 py-5">
          <Eyebrow>{t.map.nextTitle}</Eyebrow>
          <p className="mt-2 text-[19px] text-bone">{t.map.nextName[state.next.protocol]}</p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-dim">
            {t.map.nextWhy[state.next.protocol]}
          </p>
          <button className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-marigold">
            {t.map.nextStart} <ArrowRight size={13} strokeWidth={2} />
          </button>
        </Card>
      )}

      {doc && <DoctorSummary t={t} state={state} lang={lang} onClose={() => setDoc(false)} />}
    </Screen>
  )
}

function Reading({ value, label, muted }) {
  return (
    <div>
      <p className={`font-mono text-[34px] leading-none ${muted ? 'text-faint' : 'text-bone'}`}>
        {value.toFixed(1)}
      </p>
      <p className="eyebrow mt-1 text-faint">{label}</p>
    </div>
  )
}

function Bar({ value, tone }) {
  return (
    <div className="h-[6px] w-full rounded-full bg-white/[0.05]">
      <div
        className={`h-full origin-left animate-sweep rounded-full ${
          tone === 'bone' ? 'bg-bone' : 'bg-faint'
        }`}
        style={{ width: `${(value / 10) * 100}%` }}
      />
    </div>
  )
}

// The one place where the marigold line is literal: the amount the person
// carries out of the protocol.
function ThresholdAxis({ amount, failAt, unitLabel }) {
  const max = failAt * 1.15
  const pos = (amount / max) * 100
  const fail = (failAt / max) * 100
  return (
    <div className="relative mt-3 h-9">
      <div className="absolute inset-x-0 top-4 h-px bg-white/10" />
      <div
        className="absolute top-4 h-px origin-left animate-sweep rule-threshold"
        style={{ width: `${pos}%` }}
      />
      <div className="absolute top-[7px] h-[18px] w-[2px] bg-marigold" style={{ left: `${pos}%` }} />
      <span className="absolute top-[26px] font-mono text-[9px] text-marigold" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        {amount}
      </span>
      <div className="absolute top-[9px] h-[14px] w-[2px] bg-plum" style={{ left: `${fail}%` }} />
      <span className="absolute top-[26px] font-mono text-[9px] text-plum" style={{ left: `${fail}%`, transform: 'translateX(-50%)' }}>
        {failAt} {unitLabel}
      </span>
    </div>
  )
}

// Rendered as a sheet of paper, not as an app screen: different ground,
// different type, different register.
function DoctorSummary({ t, state, lang, onClose }) {
  const d = t.map.doc
  const rows = state.queue.filter((q) => q.status === 'done')
  // The amount printed on the document must come from the same row the map
  // renders, never from a literal typed into the table.
  const amountFor = (id) => {
    const r = state.map.rows.find((x) => x.id === id)
    return r && r.status === 'threshold' ? ` — ${r.amount} ${r.unit}` : ''
  }
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-black/60 backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/70">
          {t.map.docButton}
        </span>
        <button onClick={onClose} aria-label={t.map.docClose} className="rounded-full p-1.5 text-bone/70 hover:bg-white/10">
          <X size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className="no-scrollbar mx-4 mb-5 flex-1 overflow-y-auto rounded-sm bg-[#F3EFE4] px-6 py-7 text-ink shadow-2xl paper-grain">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">Threshold</p>
        <h2 className="mt-2 font-doc text-[23px] leading-tight text-ink">{d.title}</h2>
        <p className="mt-1 font-doc text-[12px] italic text-ink/60">{d.subtitle}</p>

        <div className="my-4 h-px w-full bg-ink/20" />

        <dl className="space-y-1.5 font-doc text-[12.5px]">
          <Row k={d.fields.case} v={CASE.code} />
          <Row k={d.fields.protocol} v={d.fields.protocolValue} />
          <Row k={d.fields.dates} v={CASE.dateRange[lang]} />
          <Row k={d.fields.logged} v={String(state.check.streak)} />
          <Row k={d.fields.scale} v={d.fields.scaleValue} />
        </dl>

        <h3 className="mt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/55">
          {d.tableTitle}
        </h3>
        <table className="mt-2 w-full border-collapse font-doc text-[12.5px]">
          <thead>
            <tr className="border-b border-ink/25 text-left text-ink/55">
              <th className="py-1 font-normal">{d.cols.group}</th>
              <th className="py-1 font-normal">{d.cols.days}</th>
              <th className="py-1 font-normal">{d.cols.result}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-ink/10">
                <td className="py-1.5 pr-2">{t.groups[r.id]}</td>
                <td className="py-1.5 pr-2 text-ink/60">{r.days}</td>
                <td className="py-1.5">
                  {t.outcomes[r.outcome]}
                  {amountFor(r.id)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="mt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/55">
          {d.loadTitle}
        </h3>
        <p className="mt-1 font-doc text-[12.5px]">
          {d.loadRow(state.map.baseline.toFixed(1), state.map.current.toFixed(1), state.id)}
        </p>

        <p className="mt-6 border-t border-ink/20 pt-3 font-doc text-[11px] leading-relaxed text-ink/60">
          {d.footer}
        </p>
      </div>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex gap-3">
      <dt className="w-[104px] shrink-0 text-ink/55">{k}</dt>
      <dd className="flex-1">{v}</dd>
    </div>
  )
}
