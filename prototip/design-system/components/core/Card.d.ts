import * as React from 'react';

/**
 * 24px-radius surface. Six variants set the loudness of a block; only `dark` and `accent` cast a shadow.
 */
export interface CardProps {
  children?: React.ReactNode;
  /** default = sage-100; quiet = cream-100; accent = sage-300 + shadow; dark = forest + shadow; lift = forest-800 (nested in dark); line = 2px ring only. */
  variant?: 'default' | 'quiet' | 'accent' | 'dark' | 'lift' | 'line';
  /** 12/16px padding instead of 18/20px, for one-line rows. */
  tight?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export declare function Card(props: CardProps): JSX.Element;
