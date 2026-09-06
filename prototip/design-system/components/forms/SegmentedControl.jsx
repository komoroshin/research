import React from 'react';

export function SegmentedControl({ options = [], value, onChange, style, ...rest }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(' + Math.max(1, options.length) + ', minmax(0, 1fr))',
        gap: 4,
        background: 'var(--surface-card-quiet)',
        borderRadius: 'var(--radius-button)',
        padding: 4,
        ...style,
      }}
      {...rest}
    >
      {options.map((o, i) => {
        const on = value === i;
        return (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => onChange && onChange(i)}
            style={{
              fontFamily: 'var(--font-text)',
              fontSize: 'var(--body-sm)',
              fontWeight: on ? 700 : 500,
              color: on ? 'var(--btn-primary-fg)' : 'var(--text-body-soft)',
              background: on ? 'var(--control-on)' : 'transparent',
              textAlign: 'center',
              padding: 6,
              minHeight: 'var(--hit-min)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-segment)',
              cursor: 'pointer',
            }}
          >
            {o}
          </div>
        );
      })}
    </div>
  );
}
