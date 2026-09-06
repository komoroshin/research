import React from 'react';

export function ProgressBar({ value = 0, dark = false, style, ...rest }) {
  return (
    <div
      style={{
        height: 8,
        borderRadius: 'var(--radius-bar)',
        background: dark ? 'var(--surface-card-lift)' : 'var(--track-empty)',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          height: '100%',
          width: Math.max(0, Math.min(100, value)) + '%',
          borderRadius: 'var(--radius-bar)',
          background: dark ? 'var(--sage-300)' : 'var(--track-fill)',
        }}
      />
    </div>
  );
}
