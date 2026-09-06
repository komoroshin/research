import * as React from 'react';

/**
 * Cream-tray segmented picker with a forest selection. Used for the three onboarding questions and EN/RU.
 */
export interface SegmentedControlProps {
  options?: React.ReactNode[];
  /** Index of the selected option. */
  value?: number;
  onChange?: (index: number) => void;
  style?: React.CSSProperties;
}

export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
