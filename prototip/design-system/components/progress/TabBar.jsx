import React from 'react';

export function TabBar({ tabs = [], value, onChange, style, ...rest }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        paddingTop: 14,
        borderTop: '2px solid var(--border-strong)',
        ...style,
      }}
      {...rest}
    >
      {tabs.map((t) => {
        const on = value === t.id;
        return (
          <div
            key={t.id}
            role="button"
            tabIndex={0}
            onClick={() => onChange && onChange(t.id)}
            style={{
              flex: 1,
              fontFamily: 'var(--font-text)',
              fontSize: 'var(--nav-size)',
              fontWeight: 700,
              letterSpacing: 'var(--nav-tracking)',
              textTransform: 'uppercase',
              color: on ? 'var(--text-action)' : 'var(--text-eyebrow)',
              background: on ? 'var(--surface-card)' : 'transparent',
              minHeight: 'var(--hit-min)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              borderRadius: 'var(--radius-chip)',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </div>
        );
      })}
    </div>
  );
}
