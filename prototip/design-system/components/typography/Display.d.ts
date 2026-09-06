import * as React from 'react';

/**
 * Oswald uppercase headline. Every heading in Threshold is a Display.
 */
export interface DisplayProps {
  children?: React.ReactNode;
  /** 34 / 26 / 24 / 22 / 20 / 18px steps, or a raw CSS size. */
  size?: 'answer' | 'screen' | 'hero' | 'card' | 'inline' | 'tile' | string;
  /** \`secondary\` uses Oswald 500 — for a heading that sits under another heading. */
  weight?: 'primary' | 'secondary';
  /** Cream ink for forest surfaces. */
  dark?: boolean;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

export declare function Display(props: DisplayProps): JSX.Element;
