import React from 'react';

/* "We couldn't" states: Health denied, recognition failed, offline. Text carries the message;
   the only colour is the alert token on the rule and the label. No icons, no red fills. */
export function Notice({ label, children, action, tone = 'quiet', style, ...rest }) {
  const alert = tone === 'alert';
  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        padding: 'var(--card-pad-y-tight) var(--card-pad-x-tight)',
        background: alert ? 'var(--surface-notice)' : 'var(--surface-card-quiet)',
        boxShadow: alert ? undefined : 'var(--ring-hairline)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...style,
      }}
      {...rest}
    >
      {label ? (
        <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking)', textTransform: 'uppercase', color: alert ? 'var(--text-alert)' : 'var(--text-eyebrow)' }}>
          {label}
        </div>
      ) : null}
      <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--body-sm)', lineHeight: 'var(--body-line)', color: 'var(--text-body)' }}>{children}</div>
      {action ? <div style={{ marginTop: 2 }}>{action}</div> : null}
    </div>
  );
}
