import * as React from 'react';

/**
 * The 0-10 symptom scale from the day card: a quiet cream block, an Oswald readout, eleven 44px cells, and word anchors at both ends.
 */
export interface ScaleStepperProps {
  label?: React.ReactNode;
  /** Second line under the label, e.g. "pain or discomfort". */
  sub?: React.ReactNode;
  value?: number;
  /** Eleven words, index 0-10 ("none" … "worst ever"). */
  labels?: string[];
  onChange?: (value: number) => void;
  style?: React.CSSProperties;
}

export declare function ScaleStepper(props: ScaleStepperProps): JSX.Element;
