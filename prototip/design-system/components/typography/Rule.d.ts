import * as React from 'react';

/**
 * 64x2px sage bar that sits under a Display headline. Threshold's only decorative element.
 */
export interface RuleProps {
  dark?: boolean;
  /** Defaults to 64px; use `100%` for a full-width divider on the doctor page. */
  width?: string;
  style?: React.CSSProperties;
}

export declare function Rule(props: RuleProps): JSX.Element;
