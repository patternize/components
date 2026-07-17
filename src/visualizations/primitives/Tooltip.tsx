import { cardShadow, colors, rounded, spacing, typography } from '../../theme';

export interface TooltipRow {
  label: string;
  value: string | number;
  color?: string;
}

export interface TooltipProps {
  /** Position in the chart wrapper's coordinate space (px). */
  x: number;
  y: number;
  /** Bold first line, e.g. the x value under the cursor. */
  title?: string;
  rows: TooltipRow[];
  /** Wrapper width, used to flip the tooltip near the right edge. */
  boundsWidth?: number;
}

/**
 * Hover tooltip: white surface, 8px corners, the system's single shadow
 * tier. Values wear ink; a colored dot carries series identity.
 */
export const Tooltip = ({ x, y, title, rows, boundsWidth }: TooltipProps) => {
  const flip = boundsWidth != null && x > boundsWidth - 140;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${flip ? 'calc(-100% - 12px)' : '12px'}, -50%)`,
        background: colors.canvas,
        border: `1px solid ${colors.hairlineSoft}`,
        borderRadius: rounded.sm,
        boxShadow: cardShadow,
        padding: `${spacing.sm}px ${spacing.md}px`,
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 10
      }}
    >
      {title && (
        <div
          style={{
            ...typography.caption,
            color: colors.ink,
            marginBottom: rows.length ? spacing.xs : 0
          }}
        >
          {title}
        </div>
      )}
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            ...typography.captionSm,
            color: colors.body,
            lineHeight: 1.6
          }}
        >
          {row.color && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: row.color,
                flexShrink: 0
              }}
            />
          )}
          <span style={{ color: colors.muted }}>{row.label}</span>
          <span
            style={{
              marginLeft: 'auto',
              color: colors.ink,
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Tooltip;
