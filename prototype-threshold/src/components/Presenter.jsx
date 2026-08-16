import { RotateCcw, EyeOff } from 'lucide-react'

const SCREENS = [
  { id: 'check', n: '1' },
  { id: 'today', n: '2' },
  { id: 'signals', n: '3' },
  { id: 'map', n: '4' },
]

export default function Presenter({ t, visible, screen, week, onScreen, onWeek, onReset, onHide }) {
  if (!visible) return null
  return (
    <div className="fixed left-1/2 top-4 z-40 hidden -translate-x-1/2 sm:block">
      <div className="flex items-center gap-4 rounded-full border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-md">
        <span className="pl-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
          {t.presenter.label}
        </span>

        <Group label={t.presenter.screens}>
          {SCREENS.map((s) => (
            <Chip key={s.id} active={screen === s.id} onClick={() => onScreen(s.id)}>
              {s.n} · {t.nav[s.id]}
            </Chip>
          ))}
          <Chip active={screen === 'redflag'} onClick={() => onScreen('redflag')} tone="flag">
            {t.presenter.redFlagBtn}
          </Chip>
        </Group>

        <Group label={t.presenter.week}>
          {[1, 4, 8].map((w) => (
            <Chip key={w} active={week === w} onClick={() => onWeek(w)}>
              {w}
            </Chip>
          ))}
        </Group>

        <div className="flex items-center gap-1">
          <IconBtn onClick={onReset} title={t.presenter.reset}>
            <RotateCcw size={13} strokeWidth={1.7} />
          </IconBtn>
          <IconBtn onClick={onHide} title={t.presenter.hideHint}>
            <EyeOff size={13} strokeWidth={1.7} />
          </IconBtn>
        </div>
      </div>

    </div>
  )
}

function Group({ label, children }) {
  return (
    <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">{label}</span>
      <div className="flex gap-1">{children}</div>
    </div>
  )
}

function Chip({ active, onClick, children, tone }) {
  const base =
    'rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition whitespace-nowrap'
  const on = tone === 'flag' ? 'bg-plum text-ink' : 'bg-bone text-ink'
  const off = 'text-white/45 hover:text-white/80 hover:bg-white/5'
  return (
    <button onClick={onClick} className={`${base} ${active ? on : off}`}>
      {children}
    </button>
  )
}

function IconBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="rounded-full p-1.5 text-white/40 transition hover:bg-white/5 hover:text-white/80"
    >
      {children}
    </button>
  )
}
