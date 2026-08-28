import { useState } from 'react';
import type { Offer } from '../types';
import { TELEGRAM, ctaMessage, headline } from '../lib/data';
import { COMPANY, RESEARCH_CTA_MESSAGE } from '../lib/company';

/** Карточка направления — используется и в группах по проблемам, и на страницах отраслей. */
export function OfferCard({ offer: o, onOpen }: { offer: Offer; onOpen: (id: string) => void }) {
  return (
    <article
      className="card"
      onClick={() => onOpen(o.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(o.id);
        }
      }}
    >
      <div className="card-title" style={{ fontSize: 16 }}>{o.title}</div>
      <div className="card-field">{o.pain}</div>
      <div className="card-result">
        <span className="lbl" style={{ marginRight: 6 }}>
          {o.proof.length ? 'Уже работает у других' : 'Что вы получите'}
        </span>
        {headline(o)}
      </div>
      <div className="card-foot">
        <span className="tag budget">{o.budget}</span>
        <span className="tag">{o.timeline}</span>
        <span className="spacer" />
        <span className="pickbtn">подробнее →</span>
      </div>
    </article>
  );
}

/**
 * CTA «Обсудить задачу»: Telegram не поддерживает préfill в личный чат, поэтому
 * кладём заявку в буфер и открываем чат; буфер — прогрессивное улучшение.
 */
export function CtaButton({ item, compact = false }: { item: Offer; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const onClick = () => {
    navigator.clipboard
      ?.writeText(ctaMessage(item))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 4000);
      })
      .catch(() => undefined);
  };
  return (
    <div style={compact ? undefined : { textAlign: 'center' }}>
      <a
        className="cta-btn"
        href={TELEGRAM}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        Обсудить задачу →
      </a>
      <div className="cta-hint" aria-live="polite">
        {copied
          ? 'Текст заявки скопирован — вставьте его в чат Telegram'
          : 'Откроется Telegram @kmoroshin; текст заявки скопируется автоматически'}
      </div>
    </div>
  );
}

/**
 * Второй CTA — ступень входа: исследование за 150 000 ₽. Кладёт свою заявку
 * в буфер и открывает Telegram; рядом всегда есть почтовый запасной канал.
 */
export function ResearchCta({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const onClick = () => {
    navigator.clipboard
      ?.writeText(RESEARCH_CTA_MESSAGE)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 4000);
      })
      .catch(() => undefined);
  };
  return (
    <div style={compact ? undefined : { textAlign: 'center' }}>
      <a
        className="cta-btn research-btn"
        href={TELEGRAM}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        Заказать исследование →
      </a>
      <div className="cta-hint" aria-live="polite">
        {copied
          ? 'Текст заявки скопирован — вставьте его в чат Telegram'
          : (
            <>
              Или напишите на{' '}
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </>
          )}
      </div>
    </div>
  );
}
