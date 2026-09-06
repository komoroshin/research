import React from 'react';

export function Rule({ dark = false, width = 'var(--rule-width)', style, ...rest }) {
  return (
    <div
      style={{
        height: 'var(--rule-height)',
        width,
        background: dark ? 'var(--line-rule-on-dark)' : 'var(--line-rule)',
        flex: 'none',
        ...style,
      }}
      {...rest}
    />
  );
}
