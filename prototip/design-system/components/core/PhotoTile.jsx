import React from 'react';

export function PhotoTile({ label, sub, onClick, style, ...rest }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--surface-card-dark)',
        color: 'var(--text-display-on-dark)',
        padding: '16px 18px',
        minHeight: 118,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        boxShadow: 'var(--shadow-card)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      <div style={{ position: 'absolute', right: -26, top: -36, width: 104, height: 104, borderRadius: '50%', background: 'var(--surface-card-lift)' }} />
      <div style={{ position: 'absolute', right: 16, top: 14, width: 30, height: 30, borderRadius: '50%', boxShadow: 'inset 0 0 0 3px var(--sage-300)' }} />
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'var(--display-card)',
          lineHeight: 'var(--display-line)',
          letterSpacing: 'var(--display-tracking)',
          textTransform: 'uppercase',
          position: 'relative',
          paddingRight: 30,
        }}
      >
        {label}
      </div>
      {sub ? (
        <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--body-xs)', color: 'var(--text-muted)', marginTop: 4, position: 'relative' }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}
