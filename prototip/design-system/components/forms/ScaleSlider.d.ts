import * as React from 'react';

/**
 * Compact symptom scale: a track with a forest knob, the value in Oswald, word anchors at both
 * ends and no numbers along the track. Roughly half the height of `ScaleStepper` — use it when
 * three scales have to fit above the fold; use `ScaleStepper` when the exact value matters more
 * than the vertical space. Both read the same 0-10 model.
 */
export interface ScaleSliderProps {
  label?: React.ReactNode;
  sub?: React.ReactNode;
  value?: number;
  /** Top of the range. 10 in the day card; the v1 artboards used 5. */
  max?: number;
  /** Words indexed 0..max ("none" … "worst ever"). */
  labels?: string[];
  onChange?: (value: number) => void;
  style?: React.CSSProperties;
}

export declare function ScaleSlider(props: ScaleSliderProps): JSX.Element;
