import { useState } from 'react';
import type { Offer } from '../types';
import { TELEGRAM, ctaMessage } from '../lib/data';

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
