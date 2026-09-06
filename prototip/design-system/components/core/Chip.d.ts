import * as React from 'react';

/**
 * Quiet uppercase tag for a recognised food group (lactose, fructans, GOS…).
 */
export interface ChipProps {
  children?: React.ReactNode;
  /** `cream` on sage backgrounds, `sage` on cream backgrounds. */
  tone?: 'cream' | 'sage';
  style?: React.CSSProperties;
}

export declare function Chip(props: ChipProps): JSX.Element;
