import React, { useId } from 'react';
import { useTheme } from '../../theme/ThemeProvider';

export interface Point {
  x: number;
  y: number;
}

export interface ArrowProps {
  from: Point;
  to: Point;
  /** Curvature: 0 = straight line, higher bends more. */
  curvature?: number;
  color?: string;
  strokeWidth?: number;
  /** Dashed line. */
  dashed?: boolean;
  /** Animate the stroke drawing itself in. */
  animate?: boolean;
  label?: string;
  /** Show the arrowhead at the destination. */
  head?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * An SVG connector arrow between two points — the "point to the next one"
 * primitive for wiring stages of a pipeline (layers, blocks, tensors).
 * Render multiple inside one absolutely-positioned overlay SVG.
 */
export const Arrow = ({
  from,
  to,
  curvature = 0.2,
  color,
  strokeWidth = 2,
  dashed = false,
  animate = false,
  label,
  head = true,
  className,
  style
}: ArrowProps) => {
  const theme = useTheme();
  const stroke = color ?? theme.colors.textMuted;
  const id = useId().replace(/:/g, '');

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  // Perpendicular offset for the control point creates the curve.
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * curvature * len;
  const cy = my + ny * curvature * len;
  const d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;

  return (
    <g className={className} style={style}>
      {head && (
        <defs>
          <marker
            id={`arrowhead-${id}`}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill={stroke} />
          </marker>
        </defs>
      )}
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={
          animate ? len : dashed ? `${strokeWidth * 3} ${strokeWidth * 3}` : undefined
        }
        strokeDashoffset={animate ? len : undefined}
        markerEnd={head ? `url(#arrowhead-${id})` : undefined}
      >
        {animate && (
          <animate
            attributeName="stroke-dashoffset"
            from={len}
            to={0}
            dur={`${theme.animation.durationSlow}ms`}
            fill="freeze"
          />
        )}
      </path>
      {label && (
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontSize={12}
          fontFamily={theme.monoFamily}
          fill={theme.colors.textMuted}
        >
          {label}
        </text>
      )}
    </g>
  );
};
