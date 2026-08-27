import { useState } from 'react';
import type { Confidence, ScaleCase } from '../types';
import { TELEGRAM, budgetLabel, ctaMessage } from '../lib/data';

export function ConfidenceBadge({ c }: { c: Confidence }) {
  // Уровни каталога переиспользуют стили внутренних бейджей: review ~ high, vendor ~ medium.
  return <span className={`conf conf-${c.level === 'review' ? 'high' : 'medium'}`}>{c.label}</span>;
}

export function BudgetBadge({ item }: { item: ScaleCase }) {
  if (item.budget_band === 'undisclosed' && !item.budget_note) return null;
  return (
    <span className="tag budget" title="Бюджетная вилка, раскрытая источником кейса">
      {budgetLabel(item)}
    </span>
  );
}

/** Все цифры каталога — со слов стороны проекта; бейдж честно это проговаривает. */
export function ReportedBadge({ c }: { c: Confidence }) {
  return (
    <span
      className="mstatus reported"
      title={
        c.level === 'review'
          ? 'Результат назван клиентом проекта в верифицированном отзыве'
          : 'Результат заявлен исполнителем проекта'
      }
    >
      {c.level === 'review' ? 'со слов клиента' : 'по данным исполнителя'}
    </span>
  );
}

export function headlineMetric(c: ScaleCase) {
  return c.metrics[0];
}

/**
 * CTA «Хочу так же»: Telegram не поддерживает préfill в личный чат, поэтому
 * кладём заявку в буфер и открываем чат; буфер — прогрессивное улучшение.
 */
export function CtaButton({ item, compact = false }: { item: ScaleCase; compact?: boolean }) {
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
        Хочу так же →
      </a>
      <div className="cta-hint" aria-live="polite">
        {copied
          ? 'Текст заявки скопирован — вставьте его в чат Telegram'
          : 'Откроется Telegram @kmoroshin; текст заявки с названием кейса скопируется автоматически'}
      </div>
    </div>
  );
}
