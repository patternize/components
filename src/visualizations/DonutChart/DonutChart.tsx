import { animated, useSpring } from '@react-spring/web';
import { arc } from 'd3';
import * as React from 'react';
import { colors, seriesColor, spacing, typography } from '../../theme';
import { AnimatedNumber, ChartCard, Legend, Tooltip } from '../primitives';

const { useEffect, useMemo, useState } = React;

export interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutDatum[];
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  /** Diameter of the donut in px. */
  size?: number;
  /** Center headline; defaults to the animated total. */
  centerLabel?: string;
  formatValue?: (value: number) => string;
  flush?: boolean;
}

/**
 * Animated donut chart. Segments sweep in clockwise with a 2px surface gap
 * between them, the total counts up in the center, and hovering a segment
 * lifts it and shows a tooltip with value and share.
 */
export const DonutChart = ({
  data,
  title,
  subtitle,
  footer,
  size = 240,
  centerLabel,
  formatValue = (v) => `${v}`,
  flush
}: DonutChartProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );
  const radius = size / 2;
  const thickness = Math.max(18, size * 0.11);

  // Segment angle ranges (radians, clockwise from 12 o'clock).
  const segments = useMemo(() => {
    let angle = 0;
    return data.map((d) => {
      const start = angle;
      const sweep = total > 0 ? (d.value / total) * Math.PI * 2 : 0;
      angle += sweep;
      return { ...d, start, end: angle };
    });
  }, [data, total]);

  const dataKey = useMemo(() => JSON.stringify(data), [data]);
  const [sweepSpring, sweepApi] = useSpring(() => ({
    from: { t: 0 },
    to: { t: 1 },
    config: { tension: 60, friction: 22 }
  }));
  // Replay the sweep when the data changes.
  useEffect(() => {
    sweepApi.start({ from: { t: 0 }, to: { t: 1 } });
  }, [dataKey, sweepApi]);

  const colorOf = (d: DonutDatum, i: number) => d.color ?? seriesColor(i);

  const arcGen = (lifted: boolean) =>
    arc<{ start: number; end: number }>()
      .innerRadius(radius - thickness - (lifted ? 3 : 0))
      .outerRadius(lifted ? radius : radius - 3)
      .cornerRadius(3)
      // ~2px surface gap between segments at the outer edge
      .padAngle(2 / radius)
      .startAngle((s) => s.start)
      .endAngle((s) => s.end);

  return (
    <ChartCard title={title} subtitle={subtitle} footer={footer} flush={flush}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: spacing.lg
        }}
      >
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size} style={{ display: 'block' }}>
            <g key={dataKey} transform={`translate(${radius}, ${radius})`}>
              {segments.map((seg, i) => (
                <animated.path
                  key={seg.label}
                  d={sweepSpring.t.to((t) => {
                    const sweepTo = t * Math.PI * 2;
                    const end = Math.min(seg.end, sweepTo);
                    if (end <= seg.start) return '';
                    return (
                      arcGen(hovered === i)({ start: seg.start, end }) ?? ''
                    );
                  })}
                  fill={colorOf(seg, i)}
                  opacity={hovered != null && hovered !== i ? 0.45 : 1}
                  style={{ transition: 'opacity 150ms ease' }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
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
            <div
              style={{
                ...typography.displayXl,
                fontSize: Math.max(22, size * 0.13),
                color: colors.ink
              }}
            >
              {hovered != null && data[hovered] ? (
                formatValue(data[hovered].value)
              ) : (
                <AnimatedNumber value={total} />
              )}
            </div>
            <div style={{ ...typography.captionSm, color: colors.muted }}>
              {hovered != null && data[hovered]
                ? data[hovered].label
                : (centerLabel ?? 'Total')}
            </div>
          </div>

          {hovered != null && segments[hovered] && (
            <Tooltip
              x={
                radius +
                Math.sin(
                  (segments[hovered].start + segments[hovered].end) / 2
                ) *
                  (radius - thickness / 2)
              }
              y={
                radius -
                Math.cos(
                  (segments[hovered].start + segments[hovered].end) / 2
                ) *
                  (radius - thickness / 2)
              }
              title={segments[hovered].label}
              rows={[
                {
                  label: 'Value',
                  value: formatValue(segments[hovered].value),
                  color: colorOf(segments[hovered], hovered)
                },
                {
                  label: 'Share',
                  value:
                    total > 0
                      ? `${((segments[hovered].value / total) * 100).toFixed(1)}%`
                      : '—'
                }
              ]}
              boundsWidth={size}
            />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 140 }}>
          <Legend
            items={data.map((d, i) => ({
              label: d.label,
              color: colorOf(d, i)
            }))}
            activeLabel={hovered != null ? data[hovered]?.label : null}
          />
        </div>
      </div>
    </ChartCard>
  );
};

export default DonutChart;
