import * as React from 'react';

/**
 * Oswald quantity. In Threshold the number IS the content — never shrink it below its caption.
 */
export interface NumeralProps {
  children?: React.ReactNode;
  /** Half-size muted suffix, e.g. `/ 15` or `a full cup`. */
  unit?: React.ReactNode;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs' | '2xs' | string;
  dark?: boolean;
  style?: React.CSSProperties;
}

export declare function Numeral(props: NumeralProps): JSX.Element;
