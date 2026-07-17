import { animated, useSpring } from '@react-spring/web';
import * as React from 'react';
import {
  cardShadow,
  colors,
  rounded,
  spacing,
  status,
  typography
} from '../../theme';
import { AnimatedNumber } from '../primitives';

const { useState } = React;

export interface StatTileProps {
  /** What the number is, e.g. "Nights booked". */
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Change vs the previous period, e.g. +12.5 for +12.5%. */
  delta?: number;
  /** Context for the delta, e.g. "vs last month". */
  deltaLabel?: string;
  /** Set false when a rising number is bad (e.g. cancellations). */
  positiveIsGood?: boolean;
}

/**
 * Animated KPI tile — a hero number that counts up, with an arrow + delta
 * chip. When the headline is a single number, a tile beats a chart.
 */
export const StatTile = ({
  label,
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  delta,
  deltaLabel,
  positiveIsGood = true
}: StatTileProps) => {
  const [hovered, setHovered] = useState(false);
  const fadeIn = useSpring({
    from: { opacity: 0, y: 8 },
    to: { opacity: 1, y: 0 },
    config: { tension: 170, friction: 26 }
  });

  const isGood = delta != null && delta >= 0 === positiveIsGood;
  const deltaColor =
    delta == null ? colors.muted : isGood ? status.good : status.critical;

  return (
    <animated.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: fadeIn.opacity,
        transform: fadeIn.y.to((y) => `translateY(${y}px)`),
        background: colors.surfaceCard,
        border: `1px solid ${colors.hairlineSoft}`,
        borderRadius: rounded.md,
        boxShadow: hovered ? cardShadow : 'none',
        transition: 'box-shadow 200ms ease',
        padding: spacing.lg,
        minWidth: 180,
        flex: 1
      }}
    >
      <div style={{ ...typography.caption, color: colors.muted }}>{label}</div>
      <div
        style={{
          ...typography.displayXl,
          fontSize: 32,
          lineHeight: 1.25,
          color: colors.ink,
          margin: `${spacing.xs}px 0`
        }}
      >
        <AnimatedNumber
          value={value}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
        />
      </div>
      {delta != null && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            ...typography.captionSm
          }}
        >
          <span style={{ color: deltaColor, fontWeight: 600 }}>
            {delta >= 0 ? '↑' : '↓'}
            {Math.abs(delta).toLocaleString('en-US', {
              maximumFractionDigits: 1
            })}
            %
          </span>
          {deltaLabel && (
            <span style={{ color: colors.muted }}>{deltaLabel}</span>
          )}
        </div>
      )}
    </animated.div>
  );
};

export interface StatRowProps {
  children: React.ReactNode;
}

/** Lays out StatTiles in a wrapping, evenly stretched row. */
export const StatRow = ({ children }: StatRowProps) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: spacing.base,
      alignItems: 'stretch'
    }}
  >
    {children}
  </div>
);

export default StatTile;
