import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

export interface TokenColumnProps {
  /** Token strings, one per row (e.g. ["Data", "visualization", …]). */
  tokens: string[];
  /** Total height to distribute rows across (aligns to a sibling Matrix). */
  height: number;
  /** Index of the active / highlighted token. */
  active?: number;
  align?: 'left' | 'right';
  color?: string;
  style?: React.CSSProperties;
}

/**
 * A vertical list of token labels aligned to matrix rows — the
 * "Data / visualization / em / powers / users / to" gutter from the
 * attention screenshot.
 */
export const TokenColumn = ({
  tokens,
  height,
  active,
  align = 'right',
  color,
  style
}: TokenColumnProps) => {
  const theme = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height,
        fontFamily: theme.fontFamily,
        ...style
      }}
    >
      {tokens.map((token, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
            fontSize: 14,
            fontWeight: active === i ? 700 : 400,
            color:
              active === i ? color ?? theme.primary : theme.colors.textMuted,
            transition: `color ${theme.animation.duration}ms ${theme.animation.easing}`,
            whiteSpace: 'nowrap'
          }}
        >
          {token}
        </div>
      ))}
    </div>
  );
};
