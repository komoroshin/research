import React from 'react';

export function ScaleStepper({ label, sub, value = 0, labels = [], onChange, style, ...rest }) {
  const cells = [0,1,2,3,4,5,6,7,8,9,10];
  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        padding: '16px 18px 12px',
        background: 'var(--surface-card-quiet)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking)', textTransform: 'uppercase', color: 'var(--text-eyebrow)' }}>{label}</div>
          {sub ? <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--body-xs)', color: 'var(--text-body-soft)', marginTop: 2 }}>{sub}</div> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'flex-end', minWidth: 110 }}>
          <div style={{ fontFamily: 'var(--font-numeral)', fontWeight: 700, fontSize: 'var(--numeral-lg)', lineHeight: 'var(--numeral-line)', letterSpacing: 'var(--numeral-tracking)', color: 'var(--text-display)' }}>{value}</div>
          <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking-tight)', textTransform: 'uppercase', color: 'var(--text-action)' }}>{labels[value]}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0,1fr))', gap: 6, marginTop: 6 }}>
        {cells.map((i) => {
          const on = value === i;
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => onChange && onChange(i)}
              style={{
                minHeight: 'var(--hit-min)',
                borderRadius: 'var(--radius-tile)',
                background: on ? 'var(--control-on)' : 'var(--surface-screen)',
                boxShadow: on ? 'none' : 'var(--ring-hairline)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-numeral)',
                fontWeight: 700,
                fontSize: 18,
                color: on ? 'var(--btn-primary-fg)' : 'var(--text-display)',
                cursor: 'pointer',
              }}
            >
              {i}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking-tight)', textTransform: 'uppercase', color: 'var(--text-eyebrow-soft)' }}>0 · {labels[0]}</div>
        <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking-tight)', textTransform: 'uppercase', color: 'var(--text-eyebrow-soft)' }}>10 · {labels[10]}</div>
      </div>
    </div>
  );
}
