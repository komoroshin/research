import { useEffect, useMemo, useState } from 'react'
import { Mic, Camera, FlaskConical, Activity, Ruler, MessageCircleQuestion, Eye, ChevronRight } from 'lucide-react'
import { CONTENT } from './content.js'
import { WEEKS, PROTOCOL } from './data.js'
import Presenter from './components/Presenter.jsx'
import EveningCheck from './screens/EveningCheck.jsx'
import Calendar from './screens/Calendar.jsx'
import MealPhoto from './screens/MealPhoto.jsx'
import AskThreshold from './screens/AskThreshold.jsx'
import ChallengeDay from './screens/ChallengeDay.jsx'
import Signals from './screens/Signals.jsx'
import ToleranceMap from './screens/ToleranceMap.jsx'
import RedFlag from './screens/RedFlag.jsx'

// Порядок показа: календарь → чек → еда → челлендж → связи → карта → вопрос.
// В нижней панели календаря нет намеренно: в него ведёт полоса состояния,
// которая стоит на каждом экране потока, а семь вкладок в ряд не помещаются.
const SCREENS = ['check', 'meal', 'today', 'signals', 'map', 'ask']
const NAV_ICON = {
  check: Mic,
  meal: Camera,
  today: FlaskConical,
  signals: Activity,
  map: Ruler,
  ask: MessageCircleQuestion,
}

export default function App() {
  const [lang, setLang] = useState('en')
  const [week, setWeek] = useState(4)
  const [screen, setScreen] = useState('check')
  const [panel, setPanel] = useState(true)
  const [seed, setSeed] = useState(0)

  const t = CONTENT[lang]
  const state = WEEKS[week]

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'h' || e.key === 'H' || e.key === 'Escape') setPanel((p) => !p)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const reset = () => {
    setWeek(4)
    setScreen('check')
    setLang('en')
    setSeed((s) => s + 1)
  }

  const goto = (s) => {
    setScreen(s)
    setSeed((s2) => s2 + 1)
  }

  const body = useMemo(() => {
    const props = { t, state, lang, key: `${screen}-${week}-${seed}` }
    switch (screen) {
      case 'calendar':
        return <Calendar {...props} onOpenMap={() => goto('map')} />
      case 'check':
        return <EveningCheck {...props} onOpenMeal={() => goto('meal')} />
      case 'meal':
        return <MealPhoto {...props} />
      case 'ask':
        return <AskThreshold {...props} />
      case 'today':
        return <ChallengeDay {...props} onOpenMap={() => goto('map')} />
      case 'signals':
        return <Signals {...props} />
      case 'map':
        return <ToleranceMap {...props} />
      case 'redflag':
        return <RedFlag {...props} />
      default:
        return null
    }
  }, [screen, week, seed, lang])

  return (
    <div className="min-h-screen w-full bg-[#17191B] text-bone">
      {/* Ambient ground for the desktop stage. Neutral by design: the phone
          is the only saturated object on the page. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 0%, #23282B 0%, #191C1E 45%, #131517 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.022) 0px, rgba(255,255,255,0.022) 1px, transparent 1px, transparent 3px)',
        }}
      />

      <Presenter
        t={t}
        visible={panel}
        screen={screen}
        week={week}
        onScreen={goto}
        onWeek={(w) => {
          setWeek(w)
          setSeed((s) => s + 1)
        }}
        onReset={reset}
        onHide={() => setPanel(false)}
      />

      <div className="relative flex min-h-screen items-center justify-center p-0 sm:p-8">
        {/* На телефоне обёртка должна занимать ровно ширину экрана. Без w-full
            она была шириной по содержимому, и приложение сужалось или
            расширялось в зависимости от длины слов — по-русски шире, по-английски
            уже. */}
        <div className="relative w-full sm:w-auto">
          {/* Language toggle sits on the frame, not in the product. */}
          <div className="absolute bottom-24 right-2 z-20 flex overflow-hidden rounded-full border border-white/10 bg-black/50 backdrop-blur sm:-right-3 sm:-top-3 sm:bottom-auto">
            {['en', 'ru'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition ${
                  lang === l ? 'bg-marigold text-ink' : 'text-dim hover:text-bone'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Phone */}
          <div className={`relative h-[100dvh] w-full overflow-hidden bg-ink ${
            panel ? 'pt-[54px] sm:pt-0' : ''
          } sm:h-[844px] sm:w-[390px] sm:rounded-[46px] sm:border-[9px] sm:border-[#2B3033] sm:shadow-[0_40px_90px_-20px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.06)]`}>
            <div className="flex h-full flex-col">
              <StatusBar />
              <Header t={t} onWordmark={() => goto('check')} />
              {screen !== 'redflag' && (
                <StatusStrip
                  t={t}
                  state={state}
                  week={week}
                  active={screen === 'calendar'}
                  onOpen={() => goto('calendar')}
                />
              )}
              <main className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">{body}</main>
              {screen !== 'redflag' && <Nav t={t} screen={screen} onScreen={goto} />}
            </div>
          </div>
        </div>
      </div>

      {!panel && (
        <>
          <button
            onClick={() => setPanel(true)}
            aria-label={t.presenter.label}
            className="fixed right-3 top-3 z-30 rounded-full border border-white/15 bg-black/50 p-2 text-white/50 backdrop-blur transition hover:text-white sm:right-4 sm:top-4"
          >
            <Eye size={14} strokeWidth={1.7} />
          </button>
          <p className="fixed bottom-3 left-1/2 z-30 hidden -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/25 sm:block">
            {t.presenter.showHint}
          </p>
        </>
      )}
    </div>
  )
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pb-1 pt-3 font-mono text-[11px] text-dim">
      <span>21:04</span>
      <span className="flex items-center gap-[3px]" aria-hidden>
        <i className="block h-[7px] w-[2px] rounded-sm bg-dim/70" />
        <i className="block h-[9px] w-[2px] rounded-sm bg-dim/70" />
        <i className="block h-[11px] w-[2px] rounded-sm bg-dim" />
        <i className="ml-1 block h-[9px] w-[16px] rounded-[2px] border border-dim/60" />
      </span>
    </div>
  )
}

function Header({ t, onWordmark }) {
  return (
    <header className="flex items-baseline justify-between px-6 pb-2 pt-1">
      <button onClick={onWordmark} className="text-left">
        <span className="font-mono text-[13px] uppercase tracking-[0.3em] text-bone">{t.brand}</span>
      </button>
    </header>
  )
}

// Фаза раньше стояла подписью в шапке. Теперь её несёт полоса, и дублировать
// её в двух соседних строках незачем.
function StatusStrip({ t, state, week, active, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className={`mx-6 mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition ${
        active
          ? 'border-marigold/40 bg-marigold/[0.07]'
          : 'border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05]'
      }`}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-bone">
        {t.statusStrip.week(week, PROTOCOL.totalDays / 7)}
      </span>
      <span className="text-faint">·</span>
      <span className="flex-1 font-mono text-[10px] uppercase tracking-[0.12em] text-dim">
        {t.calendar.phases[state.calendar.currentPhase].name}
      </span>
      <ChevronRight size={13} strokeWidth={1.8} className={active ? 'text-marigold' : 'text-faint'} />
    </button>
  )
}

function Nav({ t, screen, onScreen }) {
  return (
    <nav className="border-t border-white/[0.06] bg-[#0A1B20] px-2 pb-5 pt-2">
      <ul className="flex">
        {SCREENS.map((s) => {
          const Icon = NAV_ICON[s]
          const active = screen === s
          return (
            <li key={s} className="flex-1">
              <button
                onClick={() => onScreen(s)}
                aria-current={active ? 'page' : undefined}
                className="group flex w-full flex-col items-center gap-1 rounded-xl py-1.5 px-0.5"
              >
                <Icon
                  size={16}
                  strokeWidth={1.6}
                  className={active ? 'text-marigold' : 'text-faint group-hover:text-dim'}
                />
                <span
                  className={`font-mono text-[8px] uppercase tracking-[0.08em] ${
                    active ? 'text-bone' : 'text-faint group-hover:text-dim'
                  }`}
                >
                  {t.nav[s]}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
