import React from 'react';

const variants = {
  primary: { background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-fg)', hover: 'var(--btn-primary-bg-hover)' },
  accent: { background: 'var(--btn-accent-bg)', color: 'var(--btn-accent-fg)', hover: 'var(--btn-accent-bg-hover)' },
  ghost: { background: 'transparent', color: 'var(--btn-ghost-fg)', boxShadow: 'var(--ring-strong)', hover: 'transparent' },
  cream: { background: 'var(--btn-cream-bg)', color: 'var(--btn-cream-fg)', hover: 'var(--btn-cream-bg)' },
};

export function Button({ children, variant = 'primary', disabled = false, onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const v = variants[variant] || variants.primary;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: 0,
        borderRadius: 'var(--radius-button)',
        padding: 'var(--btn-pad-y) var(--btn-pad-x)',
        minHeight: 'var(--btn-min-height)',
        width: '100%',
        fontFamily: 'var(--font-text)',
        fontSize: 'var(--btn-size)',
        fontWeight: 'var(--btn-weight)',
        letterSpacing: 'var(--btn-tracking)',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'var(--transition-color)',
        opacity: disabled ? 0.5 : 1,
        background: hover && !disabled ? v.hover : v.background,
        color: v.color,
        boxShadow: v.boxShadow,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
