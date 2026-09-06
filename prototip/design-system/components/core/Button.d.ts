import * as React from 'react';

/**
 * Full-width action button. One primary per screen — the only exception is the suspicion screen,
 * where three `accent` buttons are deliberately equal in weight.
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = forest fill; accent = sage fill; ghost = 2px sage ring; cream = for forest surfaces. */
  variant?: 'primary' | 'accent' | 'ghost' | 'cream';
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export declare function Button(props: ButtonProps): JSX.Element;
