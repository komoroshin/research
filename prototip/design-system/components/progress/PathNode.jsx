import React from 'react';

export function PathNode({ title, meta, state = 'ahead', children, last = false, style, ...rest }) {
  const pin =
    state === 'done'
      ? { background: 'var(--day-done)', boxShadow: 'none' }
      : state === 'current'
      ? { background: 'var(--control-on)', boxShadow: 'var(--ring-current)' }
      : { background: 'var(--surface-screen)', boxShadow: 'var(--ring-strong)' };
  const box =
    state === 'current'
      ? { background: 'var(--surface-card)' }
      : state === 'ahead'
      ? { background: 'transparent', boxShadow: 'inset 0 0 0 2px var(--surface-card-quiet)' }
      : { background: 'var(--surface-card-quiet)' };
  const dim = state === 'ahead';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12, ...style }} {...rest}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, flex: 'none', marginTop: 4, ...pin }} />
        {last ? null : <div style={{ flex: 1, width: 2, background: 'var(--sage-300)', margin: '4px 0', minHeight: 18 }} />}
      </div>
      <div style={{ borderRadius: 'var(--radius-node)', padding: '12px 14px', marginBottom: 6, ...box }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <div style={{ fontFamily: 'var(--font-text)', fontWeight: 700, fontSize: 'var(--body-md)', color: dim ? 'var(--text-muted)' : 'var(--text-body)' }}>{title}</div>
          <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking-tight)', textTransform: 'uppercase', color: dim ? 'var(--text-muted)' : 'var(--text-eyebrow)' }}>{meta}</div>
        </div>
        {children ? <div style={{ marginTop: 8 }}>{children}</div> : null}
      </div>
    </div>
  );
}
