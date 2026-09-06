import * as React from 'react';

/**
 * Three-tab bottom navigation (Today · Path · Tips) — a 2px sage rule with sage-filled active pill. No icons.
 */
export interface TabBarProps {
  tabs?: { id: string; label: string }[];
  value?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}

export declare function TabBar(props: TabBarProps): JSX.Element;
