import * as React from 'react';

/**
 * The 8-day test scale. A skipped day differs by fill, not by an error colour.
 */
export interface DayDotsProps {
  /** One character per day: d = done, t = today, a = ahead, s = skipped (not counted). */
  pattern?: string;
  style?: React.CSSProperties;
}

export declare function DayDots(props: DayDotsProps): JSX.Element;
