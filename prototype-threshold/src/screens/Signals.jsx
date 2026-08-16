import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { Info } from 'lucide-react'
import { Screen, Eyebrow, Card, ThresholdRule } from '../components/bits.jsx'
import { CASE } from '../data.js'

export default function Signals({ t, state }) {
  const s = state.signals

  if (!s.enough) {
    return (
      <Screen>
        <Eyebrow>{t.signals.eyebrow}</Eyebrow>
        <h1 className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">
          {t.signals.emptyTitle}
        </h1>
        <div className="mt-5">
          <ThresholdRule />
        </div>
        <Card className="mt-5 px-5 py-6">
          <p className="font-mono text-[38px] leading-none text-bone">
            {s.daysLogged}
            <span className="text-[16px] text-faint"> / {s.daysNeeded}</span>
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-dim">
            {t.signals.emptyBody(s.daysLogged, s.daysNeeded)}
          </p>
        </Card>
      </Screen>
    )
  }

  return (
    <Screen>
      <Eyebrow>{t.signals.eyebrow}</Eyebrow>
      <h1 className="mt-2 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">
        {t.signals.title}
      </h1>
      <div className="mt-5">
        <ThresholdRule />
      </div>

      {/* Primary association */}
      <Card className="mt-5 px-5 py-5">
        <p className="flex flex-wrap items-baseline gap-2 text-[19px] text-bone">
          <span>{t.groups[s.primary.group]}</span>
          <span className="text-marigold">{t.signals.arrow}</span>
          <span>{t.check.fields[s.primary.symptom]}</span>
        </p>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.1em] text-dim">
          <span>{t.signals.lag(s.primary.lagHours)}</span>
          <span className="text-marigold">{t.signals.hits(s.primary.hits, s.primary.of)}</span>
        </p>

        <p className="eyebrow mt-4 text-faint">{t.signals.window}</p>
        <div className="-ml-2 mt-1 h-[168px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={s.series} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
              <XAxis
                dataKey="day"
                tick={{ fill: '#5D7278', fontSize: 9, fontFamily: 'ui-monospace, monospace' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                tickLine={false}
                interval={1}
                padding={{ left: 8, right: 8 }}
                tickMargin={6}
              />
              <YAxis domain={[0, 8]} hide />
              {/* The signature line, in its third appearance: the level above
                  which an evening counts as a reaction. */}
              <ReferenceLine
                y={CASE.reactionLine}
                stroke="#E9A93C"
                strokeDasharray="3 4"
                strokeWidth={1}
              />
              <Line
                type="monotone"
                dataKey="load"
                stroke="#EFE9DC"
                strokeWidth={1.6}
                dot={{ r: 2.4, fill: '#EFE9DC', strokeWidth: 0 }}
                isAnimationActive={false}
              />
              <Scatter dataKey="exposure" fill="#C078A6" shape="square" isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] uppercase tracking-[0.12em] text-faint">
          <Legend color="#EFE9DC" shape="line">{t.signals.legend.load}</Legend>
          <Legend color="#C078A6" shape="square">{t.signals.legend.exposure}</Legend>
          <Legend color="#E9A93C" shape="dash">{t.signals.legend.line}</Legend>
        </ul>

        <p className="mt-4 border-t border-white/[0.06] pt-3 text-[13px] leading-relaxed text-bone/80">
          {t.signals.explainPrimary}
        </p>
      </Card>

      {/* Boundary of the claim — deliberately not a footnote */}
      <div className="mt-4 flex gap-3 rounded-2xl border border-marigold/25 bg-marigold/[0.06] px-4 py-4">
        <Info size={15} strokeWidth={1.8} className="mt-[2px] shrink-0 text-marigold" />
        <div>
          <p className="eyebrow text-marigold">{t.signals.disclaimerTitle}</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-bone/85">{t.signals.disclaimer}</p>
        </div>
      </div>

      {/* Counter-example */}
      <Card className="mt-4 px-5 py-5">
        <p className="flex flex-wrap items-baseline gap-2 text-[17px] text-bone">
          <span>{t.groups[s.counter.group]}</span>
          <span className="text-faint">{t.signals.arrow}</span>
          <span className="text-dim">{t.signals.counterTitle}</span>
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] text-faint">
          {t.signals.hits(s.counter.hits, s.counter.of)}
        </p>
        <p className="mt-3 text-[12.5px] leading-relaxed text-dim">
          {t.signals.counterBody(t.groups[s.counter.group], s.counter.hits, s.counter.of)}
        </p>
      </Card>
    </Screen>
  )
}

function Legend({ color, shape, children }) {
  return (
    <li className="flex items-center gap-1.5">
      {shape === 'line' && <span className="block h-[2px] w-4 rounded" style={{ background: color }} />}
      {shape === 'square' && <span className="block h-[7px] w-[7px]" style={{ background: color }} />}
      {shape === 'dash' && (
        <span
          className="block h-[2px] w-4"
          style={{ backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 7px)` }}
        />
      )}
      {children}
    </li>
  )
}
