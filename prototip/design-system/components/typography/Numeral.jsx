import React from 'react';

const sizes = {
  xl: 'var(--numeral-xl)',
  lg: 'var(--numeral-lg)',
  md: 'var(--numeral-md)',
  sm: 'var(--numeral-sm)',
  xs: 'var(--numeral-xs)',
  '2xs': 'var(--numeral-2xs)',
};

export function Numeral({ children, unit, size = 'lg', dark = false, style, ...rest }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-numeral)',
        fontWeight: 'var(--numeral-weight)',
        fontSize: sizes[size] || size,
        lineHeight: 'var(--numeral-line)',
        letterSpacing: 'var(--numeral-tracking)',
        fontVariantNumeric: 'tabular-nums',
        color: dark ? 'var(--text-display-on-dark)' : 'var(--text-display)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {unit ? (
        <span style={{ fontSize: '0.5em', color: dark ? 'var(--text-unit-on-dark)' : 'var(--text-unit)' }}>
          {' '}
          {unit}
        </span>
      ) : null}
    </div>
  );
}
