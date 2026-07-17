import { animated, useSpring } from '@react-spring/web';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import * as React from 'react';
import {
  chrome,
  fontFamily,
  sequentialRausch,
  sequentialTeal
} from '../../theme';
import { ChartCard, Tooltip } from '../primitives';

const { useMemo, useState } = React;

export interface HeatmapProps {
  /** Row labels, top to bottom. */
  rows: string[];
  /** Column labels, left to right. */
  columns: string[];
  /** values[rowIndex][columnIndex]. */
  values: number[][];
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  /** Sequential ramp: one hue, light→dark. */
  ramp?: 'teal' | 'rausch';
  cellSize?: number;
  /** Print values inside cells (ink flips for dark cells). */
  showValues?: boolean;
  formatValue?: (value: number) => string;
  flush?: boolean;
}

const LEFT_GUTTER = 72;
const TOP_GUTTER = 24;
const GAP = 2;

interface PlotProps extends HeatmapProps {
  width: number;
}

const HeatmapPlot = ({
  rows,
  columns,
  values,
  ramp = 'teal',
  cellSize,
  showValues = false,
  formatValue = (v) => `${v}`,
  width
}: PlotProps) => {
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null);

  const rampColors = ramp === 'rausch' ? sequentialRausch : sequentialTeal;

  const size =
    cellSize ??
    Math.max(
      18,
      Math.min(48, Math.floor((width - LEFT_GUTTER) / columns.length) - GAP)
    );

  const { min, max } = useMemo(() => {
    const flat = values.flat();
    return {
      min: Math.min(...flat),
      max: Math.max(...flat)
    };
  }, [values]);

  const colorFor = (v: number) => {
    const t = max > min ? (v - min) / (max - min) : 0.5;
    const index = Math.min(
      rampColors.length - 1,
      Math.floor(t * rampColors.length)
    );
    return { color: rampColors[index], dark: index >= rampColors.length / 2 };
  };

  const dataKey = useMemo(() => JSON.stringify(values), [values]);
  const reveal = useSpring({
    from: { t: 0 },
    to: { t: 1 },
    config: { tension: 90, friction: 26 }
  });

  const height = TOP_GUTTER + rows.length * (size + GAP);
  const labelText: React.CSSProperties = {
    fontFamily,
    fontSize: 12,
    fill: chrome.axisLabel
  };
  const total = rows.length * columns.length;

  return (
    <div style={{ position: 'relative' }}>
      <svg
        width={LEFT_GUTTER + columns.length * (size + GAP)}
        height={height}
        style={{ display: 'block', maxWidth: '100%' }}
      >
        {columns.map((col, c) => (
          <text
            key={col}
            x={LEFT_GUTTER + c * (size + GAP) + size / 2}
            y={TOP_GUTTER - 10}
            textAnchor="middle"
            style={labelText}
          >
            {col}
          </text>
        ))}
        {rows.map((row, r) => (
          <text
            key={row}
            x={LEFT_GUTTER - 10}
            y={TOP_GUTTER + r * (size + GAP) + size / 2}
            dy="0.32em"
            textAnchor="end"
            style={labelText}
          >
            {row}
          </text>
        ))}

        <g key={dataKey}>
          {values.map((rowValues, r) =>
            rowValues.map((v, c) => {
              if (v == null) return null;
              const { color, dark } = colorFor(v);
              const order = r * columns.length + c;
              const isHovered = hovered?.r === r && hovered?.c === c;
              return (
                <g key={`${r}-${c}`}>
                  <animated.rect
                    x={LEFT_GUTTER + c * (size + GAP)}
                    y={TOP_GUTTER + r * (size + GAP)}
                    width={size}
                    height={size}
                    rx={4}
                    fill={color}
                    stroke={isHovered ? chrome.ink : 'none'}
                    strokeWidth={isHovered ? 1.5 : 0}
                    opacity={reveal.t.to((t) =>
                      Math.max(0, Math.min(1, (t * (total + 12) - order) / 12))
                    )}
                    onMouseEnter={() => setHovered({ r, c })}
                    onMouseLeave={() => setHovered(null)}
                  />
                  {showValues && size >= 26 && (
                    <text
                      x={LEFT_GUTTER + c * (size + GAP) + size / 2}
                      y={TOP_GUTTER + r * (size + GAP) + size / 2}
                      dy="0.32em"
                      textAnchor="middle"
                      pointerEvents="none"
                      style={{
                        fontFamily,
                        fontSize: 11,
                        fontWeight: 600,
                        fill: dark ? '#ffffff' : chrome.secondaryInk,
                        fontVariantNumeric: 'tabular-nums'
                      }}
                    >
                      {formatValue(v)}
                    </text>
                  )}
                </g>
              );
            })
          )}
        </g>
      </svg>

      {hovered && values[hovered.r]?.[hovered.c] != null && (
        <Tooltip
          x={LEFT_GUTTER + hovered.c * (size + GAP) + size / 2}
          y={TOP_GUTTER + hovered.r * (size + GAP) + size / 2}
          title={`${rows[hovered.r]} · ${columns[hovered.c]}`}
          rows={[
            {
              label: 'Value',
              value: formatValue(values[hovered.r][hovered.c])
            }
          ]}
          boundsWidth={LEFT_GUTTER + columns.length * (size + GAP)}
        />
      )}
    </div>
  );
};

/**
 * Animated matrix heatmap on a one-hue sequential ramp (light→dark =
 * low→high). Cells sweep in reading order and each cell carries a hover
 * tooltip; `showValues` prints the numbers for exact reading.
 */
export const Heatmap = (props: HeatmapProps) => (
  <ChartCard
    title={props.title}
    subtitle={props.subtitle}
    footer={props.footer}
    flush={props.flush}
  >
    <ParentSize debounceTime={10}>
      {({ width }) =>
        width > 0 ? (
          <HeatmapPlot
            {...props}
            key={JSON.stringify(props.values)}
            width={width}
          />
        ) : null
      }
    </ParentSize>
  </ChartCard>
);

export default Heatmap;
