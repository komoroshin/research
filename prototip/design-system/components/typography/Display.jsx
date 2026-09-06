import React from 'react';

const sizes = {
  answer: 'var(--display-answer)',
  screen: 'var(--display-screen)',
  hero: 'var(--display-hero)',
  card: 'var(--display-card)',
  inline: 'var(--display-inline)',
  tile: 'var(--display-tile)',
};

export function Display({ children, size = 'screen', weight = 'primary', dark = false, as = 'div', style, ...rest }) {
  const Tag = as;
  return (
    <Tag
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: weight === 'secondary' ? 'var(--display-weight-secondary)' : 'var(--display-weight)',
        fontSize: sizes[size] || size,
        lineHeight: 'var(--display-line)',
        letterSpacing: 'var(--display-tracking)',
        textTransform: 'uppercase',
        color: dark ? 'var(--text-display-on-dark)' : 'var(--text-display)',
        textWrap: 'balance',
        margin: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
