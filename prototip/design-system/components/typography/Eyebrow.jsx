import React from 'react';

const tone = {
  default: 'var(--text-eyebrow)',
  soft: 'var(--text-eyebrow-soft)',
  dark: 'var(--text-eyebrow-on-dark)',
  forest: 'var(--text-action)',
};

export function Eyebrow({ children, tone: t = 'default', tight = false, style, ...rest }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-text)',
        fontSize: 'var(--eyebrow-size)',
        fontWeight: 'var(--eyebrow-weight)',
        letterSpacing: tight ? 'var(--eyebrow-tracking-tight)' : 'var(--eyebrow-tracking)',
        textTransform: 'uppercase',
        color: tone[t] || tone.default,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
