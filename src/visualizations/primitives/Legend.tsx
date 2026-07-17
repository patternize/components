import { colors, spacing, typography } from '../../theme';

export interface LegendItem {
  label: string;
  color: string;
}

export interface LegendProps {
  items: LegendItem[];
  /** Highlighted series name; others fade so identity never relies on color alone. */
  activeLabel?: string | null;
  onHover?: (label: string | null) => void;
}

/**
 * Swatch-dot legend. Labels wear ink — the colored dot beside them carries
 * series identity. Rendered for two or more series (a single series is
 * named by the chart title instead).
 */
export const Legend = ({ items, activeLabel, onHover }: LegendProps) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: `${spacing.xs}px ${spacing.base}px`,
      marginTop: spacing.md
    }}
  >
    {items.map((item) => {
      const dimmed = activeLabel != null && activeLabel !== item.label;
      return (
        <span
          key={item.label}
          onMouseEnter={onHover ? () => onHover(item.label) : undefined}
          onMouseLeave={onHover ? () => onHover(null) : undefined}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.sm,
            opacity: dimmed ? 0.35 : 1,
            transition: 'opacity 150ms ease',
            cursor: onHover ? 'default' : undefined
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: item.color,
              flexShrink: 0
            }}
          />
          <span style={{ ...typography.captionSm, color: colors.body }}>
            {item.label}
          </span>
        </span>
      );
    })}
  </div>
);

export default Legend;
