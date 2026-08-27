import { useState } from 'react';
import type { ScaleCase } from '../types';
import { TELEGRAM, budgetLabel, ctaMessage } from '../lib/data';

export function BudgetBadge({ item }: { item: ScaleCase }) {
  if (item.budget_band === 'undisclosed' && !item.budget_note) return null;
  return <span className="tag budget">{budgetLabel(item)}</span>;
}

export function headlineMetric(c: ScaleCase) {
  return c.metrics[0];
}

/**
 * Заголовок кейса для клиента — сразу про результат. Рукописный headline
 * («Выплата разбирается за 12 минут вместо 45») важнее автосборки из метрики;
 * если цифр нет, остаётся содержательный заголовок кейса.
 */
export function resultHeadline(c: ScaleCase): { head: string; sub: string } {
  if (c.headline) return { head: c.headline, sub: c.title };
  const m = headlineMetric(c);
  if (m) return { head: `${m.name}: ${m.result}`, sub: c.title };
  return { head: c.title, sub: c.result_summary };
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
