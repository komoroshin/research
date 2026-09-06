import React from 'react';

/* Bristol shapes are drawn with the brand's own CSS gradients/masks — copied verbatim from the prototype. */
const shapes = [
  { height: 2, width: 24, background: 'var(--sage-500)', borderRadius: 2, margin: '7px 0' },
  { background: 'radial-gradient(circle 4px,var(--c) 96%,transparent 100%) 0 0/14px 16px repeat-x' },
  { borderRadius: 8, background: 'var(--c)', WebkitMaskImage: 'radial-gradient(circle 3px at 8px 5px,transparent 95%,#000 100%),radial-gradient(circle 3px at 24px 11px,transparent 95%,#000 100%),radial-gradient(circle 3px at 36px 5px,transparent 95%,#000 100%)', WebkitMaskComposite: 'source-in', maskImage: 'radial-gradient(circle 3px at 8px 5px,transparent 95%,#000 100%),radial-gradient(circle 3px at 24px 11px,transparent 95%,#000 100%),radial-gradient(circle 3px at 36px 5px,transparent 95%,#000 100%)', maskComposite: 'intersect' },
  { borderRadius: 8, background: 'repeating-linear-gradient(90deg,var(--c) 0 9px,transparent 9px 11px)' },
  { borderRadius: 8, background: 'var(--c)' },
  { background: 'radial-gradient(ellipse 7px 6px,var(--c) 96%,transparent 100%) 0 0/15px 16px repeat-x' },
  { borderRadius: '60% 40% 55% 45%/50% 65% 35% 50%', background: 'var(--c)', opacity: 0.85 },
  { background: 'linear-gradient(var(--c),var(--c)) 0 3px/44px 3px no-repeat,linear-gradient(var(--c),var(--c)) 6px 10px/30px 3px no-repeat' },
];

export function StoolPicker({ value = 0, types = [], label = 'Stool', sub, keyline, onChange, style, ...rest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }} {...rest}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking)', textTransform: 'uppercase', color: 'var(--text-eyebrow)' }}>{label}</div>
          {sub ? <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--body-xs)', color: 'var(--text-body-soft)', marginTop: 2 }}>{sub}</div> : null}
        </div>
        <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking-tight)', textTransform: 'uppercase', color: 'var(--text-action)' }}>
          {value > 0 ? value + ' · ' + types[value] : types[0]}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 6 }}>
        {types.map((t, i) => {
          const on = value === i;
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => onChange && onChange(i)}
              style={{
                borderRadius: 'var(--radius-stool)',
                background: on ? 'var(--control-on)' : 'var(--surface-screen)',
                boxShadow: on ? 'none' : 'var(--ring-hairline)',
                padding: '10px 6px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                minHeight: 84,
              }}
            >
              <div style={{ fontFamily: 'var(--font-numeral)', fontWeight: 700, fontSize: 'var(--numeral-2xs)', lineHeight: 1, color: on ? 'var(--btn-primary-fg)' : 'var(--text-display)' }}>
                {i === 0 ? '—' : i}
              </div>
              <div style={{ width: 44, height: 16, position: 'relative', '--c': on ? 'var(--cream-50)' : 'var(--forest)', ...shapes[i] }} />
              <div style={{ fontFamily: 'var(--font-text)', fontSize: 11, lineHeight: 1.2, textAlign: 'center', color: on ? 'var(--text-body-on-dark)' : 'var(--text-body-soft)' }}>{t}</div>
            </div>
          );
        })}
      </div>
      {keyline ? (
        <div style={{ fontFamily: 'var(--font-text)', fontSize: 11, textAlign: 'center', color: 'var(--text-body-soft)' }}>{keyline}</div>
      ) : null}
    </div>
  );
}
