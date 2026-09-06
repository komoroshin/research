import * as React from 'react';

/**
 * Forest confirmation strip pinned to the top of the screen for 1.8s. Confirms a saved day or meal.
 */
export interface ToastProps {
  children?: React.ReactNode;
  show?: boolean;
  style?: React.CSSProperties;
}

export declare function Toast(props: ToastProps): JSX.Element;
