import { useState } from 'react'
import { MessageCircleQuestion, X, ShieldAlert } from 'lucide-react'
import { Eyebrow } from './bits.jsx'

// Контекстный вход вместо вкладки чата: один вопрос, один заранее написанный
// ответ, всегда в рамке текущего протокола. Вариант `refusal` показывает, где
// ассистент отказывается отвечать.
export default function Assistant({ t, id, tone = 'answer' }) {
  const [open, setOpen] = useState(false)
  const refusal = tone === 'refusal'

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 flex w-full items-center gap-2.5 rounded-xl border border-white/10 px-4 py-3 text-left transition hover:bg-white/[0.03]"
      >
        <MessageCircleQuestion size={15} strokeWidth={1.7} className="shrink-0 text-marigold" />
        <span className="flex-1 text-[13px] leading-snug text-dim">{t.assistant.questions[id]}</span>
      </button>
    )
  }

  return (
    <div
      className={`mt-4 animate-rise rounded-xl border px-4 py-4 ${
        refusal ? 'border-plum/30 bg-plum/[0.06]' : 'border-marigold/25 bg-marigold/[0.05]'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {refusal ? (
          <ShieldAlert size={15} strokeWidth={1.8} className="mt-[2px] shrink-0 text-plum" />
        ) : (
          <MessageCircleQuestion size={15} strokeWidth={1.8} className="mt-[2px] shrink-0 text-marigold" />
        )}
        <p className="flex-1 text-[13px] leading-snug text-bone">{t.assistant.questions[id]}</p>
        <button
          onClick={() => setOpen(false)}
          aria-label={t.assistant.close}
          className="-mr-1 -mt-1 shrink-0 rounded-full p-1 text-faint hover:text-bone"
        >
          <X size={14} strokeWidth={1.8} />
        </button>
      </div>

      <p className="mt-3 border-t border-white/[0.07] pt-3 text-[13px] leading-relaxed text-bone/85">
        {t.assistant.answers[id]}
      </p>

      {refusal && (
        <p className="mt-2">
          <Eyebrow>
            <span className="text-plum">{t.assistant.refusalNote}</span>
          </Eyebrow>
        </p>
      )}
    </div>
  )
}
