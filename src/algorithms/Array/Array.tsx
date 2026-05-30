import React from 'react';
import { animated, useTransition } from '@react-spring/web';
import { useTheme } from '../../theme/ThemeProvider';
import { readableText } from '../../theme/color';

export interface ColorRange {
  start: number;
  end: number;
  color: string;
}

export interface ArrayProps {
  /** The values to render, left to right. */
  data: number[];
  /** Indices to emphasize (e.g. the current comparison window). */
  highlights?: number[];
  /** Color contiguous index ranges (used by the Sorting visualizations). */
  colorRanges?: ColorRange[];
  /** Pixel size of each cell. */
  cellSize?: number;
  /** Show the index beneath each cell. */
  showIndices?: boolean;
  color?: string;
  animate?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

/**
 * A horizontal array of values — the atomic building block for sorting,
 * sliding-window and two-pointer visualizations.
 */
export const Array = ({
  data,
  highlights = [],
  colorRanges = [],
  cellSize = 44,
  showIndices = true,
  color,
  animate = true,
  style
}: ArrayProps) => {
  const theme = useTheme();
  const fill = color ?? theme.primary;
  const rangeColor = (index: number): string | null => {
    const range = colorRanges.find((r) => index >= r.start && index <= r.end);
    return range ? range.color : null;
  };

  const items = data.map((value, index) => ({ value, index, key: index }));
  const transitions = useTransition(items, {
    keys: (item) => item.key,
    from: { opacity: 0, transform: 'translateY(-8px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(8px)' },
    immediate: !animate,
    config: theme.animation.spring
  });

  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 6,
        fontFamily: theme.fontFamily,
        ...style
      }}
    >
      {transitions((springStyle, item) => {
        const active = highlights.includes(item.index);
        const bg = active ? theme.colors.accent : rangeColor(item.index) ?? fill;
        return (
          <animated.div
            style={{
              ...springStyle,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4
            }}
          >
            <div
              style={{
                width: cellSize,
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: theme.radius / 2,
                background: bg,
                color: readableText(bg),
                fontWeight: 600,
                fontFamily: theme.monoFamily,
                boxShadow: active
                  ? `0 0 0 3px ${theme.colors.text}`
                  : '0 1px 2px rgba(0,0,0,0.12)',
                transition: `background ${theme.animation.duration}ms ${theme.animation.easing}`
              }}
            >
              {item.value}
            </div>
            {showIndices && (
              <div style={{ fontSize: 11, color: theme.colors.textMuted }}>
                {item.index}
              </div>
            )}
          </animated.div>
        );
      })}
    </div>
  );
};
