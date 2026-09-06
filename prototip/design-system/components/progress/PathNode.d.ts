import * as React from 'react';

/**
 * One stage on the Path screen: pin, connector, and a box whose fill states past / current / ahead.
 */
export interface PathNodeProps {
  title?: React.ReactNode;
  /** Right-aligned uppercase meta, e.g. "day 14 of ~21" or "completed". */
  meta?: React.ReactNode;
  state?: 'done' | 'current' | 'ahead';
  children?: React.ReactNode;
  /** Hides the connector on the final node. */
  last?: boolean;
  style?: React.CSSProperties;
}

export declare function PathNode(props: PathNodeProps): JSX.Element;
