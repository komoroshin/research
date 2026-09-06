import React from 'react';

export function Toast({ children, show = true, style, ...rest }) {
  return (
    <div
      style={{
        background: 'var(--surface-card-dark)',
        color: 'var(--text-display-on-dark)',
        borderRadius: 'var(--radius-button)',
        padding: '14px 18px',
        fontFamily: 'var(--font-text)',
        fontSize: 'var(--body-md)',
        lineHeight: 1.4,
        boxShadow: 'var(--shadow-card)',
        opacity: show ? 1 : 0,
        transition: 'var(--transition-fade)',
        pointerEvents: 'none',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
