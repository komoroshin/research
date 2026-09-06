import React from 'react';

export function Switch({ checked = false, onChange, style, ...rest }) {
  return (
    <div
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange && onChange(!checked)}
      style={{
        width: 51,
        height: 31,
        borderRadius: 'var(--radius-switch)',
        background: checked ? 'var(--control-on)' : 'var(--control-off)',
        position: 'relative',
        flex: 'none',
        cursor: 'pointer',
        transition: 'var(--transition-color)',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: checked ? 22 : 2,
          width: 27,
          height: 27,
          borderRadius: 'var(--radius-knob)',
          background: 'var(--control-knob)',
          transition: 'var(--transition-knob)',
        }}
      />
    </div>
  );
}
