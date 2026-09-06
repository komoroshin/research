import React from 'react';

export function ActionLink({ children, dark = false, onClick, style, ...rest }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-text)',
        fontSize: 'var(--action-size)',
        fontWeight: 'var(--action-weight)',
        letterSpacing: 'var(--action-tracking)',
        textTransform: 'uppercase',
        color: dark ? 'var(--text-action-on-dark)' : 'var(--text-action)',
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 'var(--hit-min)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {children}
      <span style={{ marginLeft: 6, fontSize: 18, lineHeight: 1 }}>›</span>
    </div>
  );
}
