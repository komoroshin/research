import * as React from 'react';

/**
 * Bristol-scale picker, 8 tiles in a 4-column grid. Shapes are drawn in CSS from the palette — there are no illustrations.
 */
export interface StoolPickerProps {
  /** 0 = none, 1-7 = Bristol type. */
  value?: number;
  /** Eight words: ['none','hard lumps','lumpy sausage','cracked surface','smooth, soft','soft pieces','mushy','liquid']. */
  types?: string[];
  label?: React.ReactNode;
  sub?: React.ReactNode;
  /** Legend line, e.g. "1-2 constipation · 3-5 normal · 6-7 loose". */
  keyline?: React.ReactNode;
  onChange?: (value: number) => void;
  style?: React.CSSProperties;
}

export declare function StoolPicker(props: StoolPickerProps): JSX.Element;
