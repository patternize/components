import React from 'react';
import { useTheme } from '../../theme/ThemeProvider';

export type OperatorKind =
  | 'multiply'
  | 'add'
  | 'subtract'
  | 'equals'
  | 'dot'
  | 'concat'
  | 'arrow'
  | 'softmax';

const GLYPHS: Record<OperatorKind, string> = {
  multiply: '×',
  add: '+',
  subtract: '−',
  equals: '=',
  dot: '·',
  concat: '⊕',
  arrow: '→',
  softmax: 'σ'
};

export interface OperatorProps {
  kind: OperatorKind;
  /** Diameter of the badge in px. */
  size?: number;
  /** Optional caption rendered beneath the badge (e.g. "matmul"). */
  label?: string;
  /** Render as a flat glyph instead of a filled badge. */
  variant?: 'badge' | 'plain';
  color?: string;
  style?: React.CSSProperties;
}

/**
 * A single math operator glyph (×, +, =, …) used to join matrices in
 * equation-style layouts such as the Q·K·V projection.
 */
export const Operator = ({
  kind,
  size = 36,
  label,
  variant = 'plain',
  color,
  style
}: OperatorProps) => {
  const theme = useTheme();
  const glyph = GLYPHS[kind];
  const isBadge = variant === 'badge';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        ...style
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * (isBadge ? 0.5 : 0.7),
          fontWeight: 400,
          lineHeight: 1,
          color: isBadge ? '#fff' : color ?? theme.colors.textMuted,
          background: isBadge ? color ?? theme.primary : 'transparent',
          borderRadius: isBadge ? '50%' : 0,
          userSelect: 'none'
        }}
      >
        {glyph}
      </div>
      {label && (
        <div
          style={{
            fontSize: 11,
            color: theme.colors.textMuted,
            fontFamily: theme.monoFamily
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
