import * as React from 'react';

/**
 * iOS-proportioned 51x31 toggle in forest/sage. Used for the day-card flags (alcohol, unwell) and Rhythm.
 */
export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  style?: React.CSSProperties;
}

export declare function Switch(props: SwitchProps): JSX.Element;
