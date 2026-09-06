import React from 'react';

/* The v1 artboard control: a track with a forest knob, the value in Oswald, word anchors
   at both ends and no numbers along the track. Half the height of ScaleStepper. */
export function ScaleSlider({ label, sub, value = 0, max = 10, labels = [], onChange, style, ...rest }) {
  const pct = (value / max) * 100;
  const ref = React.useRef(null);
  const setFromEvent = (clientX) => {
    if (!ref.current || !onChange) return;
    const r = ref.current.getBoundingClientRect();
    const v = Math.round(((clientX - r.left) / r.width) * max);
    onChange(Math.max(0, Math.min(max, v)));
  };
  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        padding: '16px 18px 14px',
        background: 'var(--surface-card-quiet)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking)', textTransform: 'uppercase', color: 'var(--text-eyebrow)' }}>{label}</div>
          {sub ? <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--body-xs)', color: 'var(--text-body-soft)', marginTop: 2 }}>{sub}</div> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'flex-end' }}>
          <div style={{ fontFamily: 'var(--font-numeral)', fontWeight: 700, fontSize: 'var(--numeral-lg)', lineHeight: 'var(--numeral-line)', letterSpacing: 'var(--numeral-tracking)', fontVariantNumeric: 'tabular-nums', color: 'var(--text-action)' }}>{value}</div>
          <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking-tight)', textTransform: 'uppercase', color: 'var(--text-action)' }}>{labels[value]}</div>
        </div>
      </div>
      <div
        ref={ref}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        tabIndex={0}
        onClick={(e) => setFromEvent(e.clientX)}
        onKeyDown={(e) => {
          if (!onChange) return;
          if (e.key === 'ArrowRight') onChange(Math.min(max, value + 1));
          if (e.key === 'ArrowLeft') onChange(Math.max(0, value - 1));
        }}
        style={{ position: 'relative', height: 'var(--hit-min)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <div style={{ position: 'relative', height: 8, width: '100%', borderRadius: 'var(--radius-bar)', background: 'var(--track-empty)' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: 8, width: pct + '%', borderRadius: 'var(--radius-bar)', background: 'var(--track-fill)' }} />
          <div style={{ position: 'absolute', top: -10, left: 'calc(' + pct + '% - 14px)', width: 28, height: 28, borderRadius: 'var(--radius-knob)', background: 'var(--control-on)', boxShadow: 'var(--shadow-knob)' }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking-tight)', textTransform: 'uppercase', color: 'var(--text-eyebrow-soft)' }}>{labels[0]}</div>
        <div style={{ fontFamily: 'var(--font-text)', fontSize: 'var(--eyebrow-size)', fontWeight: 500, letterSpacing: 'var(--eyebrow-tracking-tight)', textTransform: 'uppercase', color: 'var(--text-eyebrow-soft)' }}>{labels[max]}</div>
      </div>
    </div>
  );
}
