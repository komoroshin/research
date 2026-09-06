import React from 'react';

const tone = {
  default: 'var(--text-body)',
  soft: 'var(--text-body-soft)',
  dark: 'var(--text-body-on-dark)',
  muted: 'var(--text-muted)',
  paper: 'var(--text-paper)',
};
const sizes = {
  lead: 'var(--body-lead)',
  md: 'var(--body-size)',
  sm: 'var(--body-md)',
  xs: 'var(--body-sm)',
  '2xs': 'var(--body-xs)',
  '3xs': 'var(--body-2xs)',
};

export function BodyText({ children, tone: t = 'default', size = 'md', strong = false, as = 'div', style, ...rest }) {
  const Tag = as;
  return (
    <Tag
      style={{
        fontFamily: 'var(--font-text)',
        fontSize: sizes[size] || size,
        fontWeight: strong ? 700 : 400,
        lineHeight: 'var(--body-line)',
        color: tone[t] || tone.default,
        textWrap: 'pretty',
        margin: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
