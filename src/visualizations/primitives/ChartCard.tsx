import * as React from 'react';
import { cardShadow, colors, rounded, spacing, typography } from '../../theme';

const { useState } = React;

export interface ChartCardProps {
  /** Card heading, set in the design system's title style. */
  title?: string;
  /** Muted one-line context under the title. */
  subtitle?: string;
  /** Caption row under the plot (source line, footnote). */
  footer?: React.ReactNode;
  /** Renders the card border/shadow-free, for embedding flush in a page. */
  flush?: boolean;
  children: React.ReactNode;
}

/**
 * The shared chart surface: white card, 14px corners, 1px hairline border,
 * and the design system's single shadow tier on hover.
 */
export const ChartCard = ({
  title,
  subtitle,
  footer,
  flush = false,
  children
}: ChartCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <figure
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        margin: 0,
        background: colors.surfaceCard,
        borderRadius: flush ? 0 : rounded.md,
        border: flush ? 'none' : `1px solid ${colors.hairlineSoft}`,
        boxShadow: !flush && hovered ? cardShadow : 'none',
        transition: 'box-shadow 200ms ease',
        padding: flush ? 0 : spacing.lg,
        color: colors.ink
      }}
    >
      {(title || subtitle) && (
        <figcaption style={{ marginBottom: spacing.base }}>
          {title && (
            <div style={{ ...typography.titleMd, color: colors.ink }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                ...typography.bodySm,
                color: colors.muted,
                marginTop: spacing.xxs
              }}
            >
              {subtitle}
            </div>
          )}
        </figcaption>
      )}
      {children}
      {footer && (
        <div
          style={{
            ...typography.captionSm,
            color: colors.muted,
            marginTop: spacing.md
          }}
        >
          {footer}
        </div>
      )}
    </figure>
  );
};

export default ChartCard;
