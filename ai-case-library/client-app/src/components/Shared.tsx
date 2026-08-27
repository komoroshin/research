import { useState } from 'react';
import type { ClientCase, Confidence, MetricStatus } from '../types';
import { TELEGRAM, ctaMessage } from '../lib/data';

/** Ссылки на источники всегда открываются в новой вкладке. */
export function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function ConfidenceBadge({ c }: { c: Confidence }) {
  return <span className={`conf conf-${c.level}`}>{c.label}</span>;
}

const STATUS_LABEL: Record<MetricStatus, string> = {
  measured: 'Измерено',
  reported: 'Заявлено',
  projected: 'Ожидаемый эффект',
};

const STATUS_HINT: Record<MetricStatus, string> = {
  measured: 'Источник сообщает о фактически достигнутом результате',
  reported: 'Цифра заявлена стороной проекта без описания методики измерения',
  projected: 'Плановый или ожидаемый эффект — ещё не достигнутый',
};

export function MetricStatusBadge({ status }: { status: MetricStatus }) {
  return (
    <span className={`mstatus ${status}`} title={STATUS_HINT[status]}>
      {STATUS_LABEL[status]}
    </span>
  );
}

/** Самая показательная метрика: измеренные важнее заявленных, заявленные важнее плановых. */
export function headlineMetric(c: ClientCase) {
  for (const s of ['measured', 'reported', 'projected'] as const) {
    const hit = c.metrics.find((m) => m.status === s);
    if (hit) return hit;
  }
  return undefined;
}

/**
 * CTA «Хочу так же»: Telegram не поддерживает préfill текста в личный чат,
 * поэтому кладём готовую заявку в буфер обмена и открываем чат — пользователю
 * остаётся вставить. Если clipboard недоступен (старый браузер, http), просто
 * открываем чат: ссылка работает всегда, буфер — прогрессивное улучшение.
 */
export function CtaButton({ item, compact = false }: { item: ClientCase; compact?: boolean }) {
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
