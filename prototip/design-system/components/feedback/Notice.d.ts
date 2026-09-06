import * as React from 'react';

/**
 * The system's only failure surface: Health denied, food not recognised, no connection, protocol
 * paused. Message in plain text, label in the alert token, no icon and no red fill.
 * `tone="alert"` is reserved for the red-flag protocol pause — everything else stays `quiet`.
 */
export interface NoticeProps {
  /** Uppercase label, e.g. "Demo data" or "Not recognised". */
  label?: React.ReactNode;
  children?: React.ReactNode;
  /** Usually a Button or ActionLink offering the way out. */
  action?: React.ReactNode;
  tone?: 'quiet' | 'alert';
  style?: React.CSSProperties;
}

export declare function Notice(props: NoticeProps): JSX.Element;
