import React from 'react';

const variants = {
  default: { background: 'var(--surface-card)' },
  quiet: { background: 'var(--surface-card-quiet)' },
  accent: { background: 'var(--surface-card-accent)', boxShadow: 'var(--shadow-card)' },
  dark: { background: 'var(--surface-card-dark)', boxShadow: 'var(--shadow-card)' },
  lift: { background: 'var(--surface-card-lift)' },
  line: { background: 'transparent', boxShadow: 'var(--ring-hairline)' },
};

export function Card({ children, variant = 'default', tight = false, onClick, style, ...rest }) {
  const v = variants[variant] || variants.default;
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 'var(--radius-card)',
        padding: tight
          ? 'var(--card-pad-y-tight) var(--card-pad-x-tight)'
          : 'var(--card-pad-y) var(--card-pad-x)',
        boxSizing: 'border-box',
        cursor: onClick ? 'pointer' : undefined,
        ...v,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
