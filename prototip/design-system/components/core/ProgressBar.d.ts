import * as React from 'react';

/**
 * 8px observation-progress bar. Shows days collected — never a percentage of an achievement.
 */
export interface ProgressBarProps {
  /** 0-100. */
  value?: number;
  dark?: boolean;
  style?: React.CSSProperties;
}

export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
