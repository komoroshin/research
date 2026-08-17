import { RotateCcw, EyeOff, TriangleAlert } from 'lucide-react'

const SCREENS = [
  { id: 'check', n: '1' },
  { id: 'today', n: '2' },
  { id: 'signals', n: '3' },
  { id: 'map', n: '4' },
]

export default function Presenter({ t, visible, screen, week, onScreen, onWeek, onReset, onHide }) {
  if (!visible) return null
  return (
    <div className="fixed left-1/2 top-2 z-40 w-[calc(100%-12px)] -translate-x-1/2 sm:top-4 sm:w-auto">
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-black/70 px-2 py-2 backdrop-blur-md sm:gap-4 sm:overflow-visible sm:bg-black/55 sm:px-3">
        <span className="hidden pl-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white/35 sm:inline">
          {t.presenter.label}
        </span>

        {/* On a phone the chips carry numbers only: the week switcher has to
            be on screen without sideways scrolling, because it is the whole
            point of the panel. */}
        <Group label={t.presenter.screens}>
          {SCREENS.map((s) => (
            <Chip key={s.id} active={screen === s.id} onClick={() => onScreen(s.id)}>
              {s.n}
              <span className="hidden sm:inline"> · {t.nav[s.id]}</span>
            </Chip>
          ))}
          <Chip active={screen === 'redflag'} onClick={() => onScreen('redflag')} tone="flag">
            <TriangleAlert size={11} strokeWidth={2.2} className="sm:hidden" />
            <span className="hidden sm:inline">{t.presenter.redFlagBtn}</span>
          </Chip>
        </Group>

        <Group label={t.presenter.week} short={t.presenter.weekShort}>
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

function Group({ label, short, children }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 border-l border-white/10 pl-2 sm:pl-4">
      {short && (
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/30 sm:hidden">
          {short}
        </span>
      )}
      <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-white/30 sm:inline">
        {label}
      </span>
      <div className="flex gap-1">{children}</div>
    </div>
  )
}

function Chip({ active, onClick, children, tone }) {
  const base =
    'flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition whitespace-nowrap'
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
