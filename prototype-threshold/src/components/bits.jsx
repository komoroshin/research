// Shared primitives. The rule here: exactly one marigold hairline per screen,
// and it always means "the line you are working on".

export function Screen({ children }) {
  return <div className="px-6 pb-8 pt-1">{children}</div>
}

export function Eyebrow({ children, tone = 'dim' }) {
  const color = tone === 'marigold' ? 'text-marigold' : 'text-faint'
  return <p className={`eyebrow ${color}`}>{children}</p>
}

export function ThresholdRule({ className = '' }) {
  return <div className={`rule-threshold h-px w-full ${className}`} aria-hidden />
}

export function Card({ children, className = '', tone = 'surface' }) {
  const bg = tone === 'raised' ? 'bg-raised' : 'bg-surface'
  return (
    <section className={`rounded-2xl border border-white/[0.06] ${bg} ${className}`}>
      {children}
    </section>
  )
}

export const STATUS_COLOR = {
  tolerated: 'text-celadon',
  reacts: 'text-plum',
  threshold: 'text-marigold',
  undetermined: 'text-dim',
  testing: 'text-marigold',
  queued: 'text-faint',
  pending: 'text-faint',
}

export const STATUS_BG = {
  tolerated: 'bg-celadon',
  reacts: 'bg-plum',
  threshold: 'bg-marigold',
  undetermined: 'bg-dim',
  testing: 'bg-marigold',
  queued: 'bg-faint',
  pending: 'bg-faint',
}

// A small square token, not a traffic light: this product reports states,
// not verdicts. Filled = resolved, outlined = still open.
const STATUS_HEX = {
  tolerated: '#74B49B',
  reacts: '#C078A6',
  threshold: '#E9A93C',
  undetermined: '#93A8A8',
  testing: '#E9A93C',
  queued: '#5D7278',
  pending: '#5D7278',
}

export function StatusMark({ status }) {
  const solid = status === 'tolerated' || status === 'reacts' || status === 'threshold'
  const hex = STATUS_HEX[status] || '#5D7278'
  return (
    <span
      aria-hidden
      className={`inline-block h-[9px] w-[9px] shrink-0 rounded-[2px] ${
        status === 'testing' ? 'animate-blip' : ''
      }`}
      style={
        solid
          ? { background: hex }
          : { border: `1px solid ${hex}`, background: 'transparent' }
      }
    />
  )
}

export function Stagger({ index, children, className = '' }) {
  return (
    <div className={`animate-rise ${className}`} style={{ animationDelay: `${index * 110}ms` }}>
      {children}
    </div>
  )
}
