import * as React from 'react';

/**
 * Uppercase wide-tracked label — the only label style in Threshold.
 */
export interface EyebrowProps {
  children?: React.ReactNode;
  /** Colour tone. `soft` for the quietest labels, `dark` on forest surfaces, `forest` when paired with a numeral. */
  tone?: 'default' | 'soft' | 'dark' | 'forest';
  /** Tighter 0.12em tracking, used when the label sits directly under a numeral. */
  tight?: boolean;
  style?: React.CSSProperties;
}

export declare function Eyebrow(props: EyebrowProps): JSX.Element;
