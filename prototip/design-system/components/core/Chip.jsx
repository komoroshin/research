import React from 'react';

export function Chip({ children, tone = 'cream', style, ...rest }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-text)',
        fontSize: 'var(--chip-size)',
        fontWeight: 'var(--chip-weight)',
        letterSpacing: 'var(--chip-tracking)',
        textTransform: 'uppercase',
        color: 'var(--text-action)',
        background: tone === 'sage' ? 'var(--surface-card)' : 'var(--surface-screen)',
        borderRadius: 'var(--radius-chip)',
        padding: '6px 10px',
        display: 'inline-block',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
