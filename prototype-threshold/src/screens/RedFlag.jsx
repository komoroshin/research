import { PauseCircle, Lock } from 'lucide-react'
import { Screen, Eyebrow } from '../components/bits.jsx'
import { RED_FLAG } from '../data.js'

// The one screen where the working line is not the user's. Marigold — the
// colour of "the step you are on" — is absent here on purpose.
export default function RedFlag({ t, lang }) {
  return (
    <Screen>
      <div className="flex items-center gap-2">
        <PauseCircle size={15} strokeWidth={1.8} className="text-plum" />
        <Eyebrow tone="marigold">
          <span className="text-plum">{t.redFlag.eyebrow}</span>
        </Eyebrow>
      </div>

      <h1 className="mt-3 text-[26px] font-medium leading-[1.15] tracking-[-0.01em]">
        {t.redFlag.title}
      </h1>

      <div className="mt-5 h-px w-full bg-plum/60" aria-hidden />

      <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.12em] text-plum">
        {t.redFlag.logged(RED_FLAG.loggedOn[lang])}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-bone/85">{t.redFlag.body}</p>

      <div className="mt-6 rounded-2xl border border-white/[0.07] bg-surface px-5 py-5">
        <Eyebrow>{t.redFlag.actionTitle}</Eyebrow>
        <ul className="mt-3 space-y-3">
          {t.redFlag.actions.map((a, i) => (
            <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed text-bone/85">
              <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-[1px] bg-plum" aria-hidden />
              {a}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 space-y-2">
        <button className="w-full rounded-xl bg-bone py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-ink transition hover:brightness-95">
          {t.redFlag.careButton}
        </button>
        <button className="w-full rounded-xl border border-white/15 py-3.5 font-mono text-[12px] uppercase tracking-[0.14em] text-bone transition hover:bg-white/[0.04]">
          {t.redFlag.exportButton}
        </button>
      </div>

      <p className="mt-6 flex gap-2.5 text-[12px] leading-relaxed text-faint">
        <Lock size={13} strokeWidth={1.7} className="mt-[2px] shrink-0" />
        {t.redFlag.lockNote}
      </p>
    </Screen>
  )
}
