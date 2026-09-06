import * as React from 'react';

/**
 * The forest "snap a meal" tile on Today — a dark card with a lens drawn from two circles (no icon font).
 */
export interface PhotoTileProps {
  label?: React.ReactNode;
  /** e.g. "photo · voice · text". */
  sub?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export declare function PhotoTile(props: PhotoTileProps): JSX.Element;
