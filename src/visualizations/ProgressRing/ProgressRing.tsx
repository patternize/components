import { animated, useSpring } from '@react-spring/web';
import { colors, typography } from '../../theme';

export interface ProgressRingProps {
  /** Progress in [0, 1]. */
  value: number;
  /** Caption under the percentage. */
  label?: string;
  size?: number;
  thickness?: number;
  color?: string;
  /** Override the center text; defaults to the animated percentage. */
  formatCenter?: (value: number) => string;
}

/**
 * Animated progress ring — the arc sweeps to its value while the center
 * percentage counts up.
 */
export const ProgressRing = ({
  value,
  label,
  size = 140,
  thickness = 10,
  color = colors.primary,
  formatCenter = (v) => `${Math.round(v * 100)}%`
}: ProgressRingProps) => {
  const clamped = Math.max(0, Math.min(1, value));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const spring = useSpring({
    from: { t: 0 },
    to: { t: clamped },
    config: { tension: 60, friction: 22 }
  });

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-block'
      }}
    >
      <svg width={size} height={size} style={{ display: 'block' }}>
        <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
          <circle
            r={radius}
            fill="none"
            stroke={colors.surfaceStrong}
            strokeWidth={thickness}
          />
          <animated.circle
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={spring.t.to((t) => circumference * (1 - t))}
          />
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}
      >
        <animated.div
          style={{
            ...typography.displaySm,
            fontSize: Math.max(16, size * 0.16),
            color: colors.ink,
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {spring.t.to((t) => formatCenter(t))}
        </animated.div>
        {label && (
          <div style={{ ...typography.captionSm, color: colors.muted }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
