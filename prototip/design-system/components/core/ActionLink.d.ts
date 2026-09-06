import * as React from 'react';

/**
 * Inline uppercase link with the brand's single chevron glyph. Threshold has no icon set — this is the affordance.
 */
export interface ActionLinkProps {
  children?: React.ReactNode;
  dark?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export declare function ActionLink(props: ActionLinkProps): JSX.Element;
