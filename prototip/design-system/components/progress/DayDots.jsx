import React from 'react';

const styles = {
  done: { background: 'var(--day-done)' },
  today: { background: 'var(--day-today)' },
  ahead: { boxShadow: 'var(--ring-strong)' },
  skipped: { background: 'var(--day-skipped)', boxShadow: 'var(--ring-strong)' },
};

export function DayDots({ pattern = 'ddtaaaaa', style, ...rest }) {
  const map = { d: 'done', t: 'today', a: 'ahead', s: 'skipped' };
  const cells = [...pattern];
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cells.length + ', minmax(0,1fr))', gap: 6, ...style }}
      {...rest}
    >
      {cells.map((c, i) => (
        <div key={i} style={{ height: 10, borderRadius: 'var(--radius-dot)', ...styles[map[c] || 'ahead'] }} />
      ))}
    </div>
  );
}
