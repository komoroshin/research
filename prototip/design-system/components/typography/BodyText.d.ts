import * as React from 'react';

/**
 * Inter running text. Threshold steps text down one level at a time — never more than one step below the thing it explains.
 */
export interface BodyTextProps {
  children?: React.ReactNode;
  tone?: 'default' | 'soft' | 'dark' | 'muted' | 'paper';
  /** 17 / 15 / 14 / 13 / 12 / 11px. */
  size?: 'lead' | 'md' | 'sm' | 'xs' | '2xs' | '3xs' | string;
  strong?: boolean;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

export declare function BodyText(props: BodyTextProps): JSX.Element;
