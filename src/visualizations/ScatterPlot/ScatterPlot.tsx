import { animated, useSpring } from '@react-spring/web';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleLinear } from 'd3';
import * as React from 'react';
import { chrome, fontFamily, scatterSafe } from '../../theme';
import { ChartCard, Legend, Tooltip, YGrid } from '../primitives';

const { useMemo, useState } = React;

export interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
}

export interface ScatterSeries {
  name: string;
  data: ScatterPoint[];
  color?: string;
}

export interface ScatterPlotProps {
  /**
   * Up to four series. In a scatter any two marks can sit side by side, so
   * the palette is capped at the four slots validated for all pairs —
   * series past the fourth fold into gray.
   */
  series: ScatterSeries[];
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  flush?: boolean;
}

const MARGIN = { top: 12, right: 20, bottom: 40, left: 52 };

interface PlotProps extends ScatterPlotProps {
  width: number;
  activeSeries: string | null;
}

const colorOf = (s: ScatterSeries, i: number) =>
  s.color ?? (i < scatterSafe.length ? scatterSafe[i] : '#929292');

const ScatterPlotPlot = ({
  series,
  height = 320,
  xLabel,
  yLabel,
  formatX = (v) => `${v}`,
  formatY = (v) => `${v}`,
  width,
  activeSeries
}: PlotProps) => {
  const [hovered, setHovered] = useState<{
    seriesIndex: number;
    pointIndex: number;
  } | null>(null);

  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  const allPoints = useMemo(() => series.flatMap((s) => s.data), [series]);
  const xScale = useMemo(() => {
    const xs = allPoints.map((p) => p.x);
    return scaleLinear()
      .domain([Math.min(0, ...xs), Math.max(1, ...xs)])
      .range([0, innerWidth])
      .nice();
  }, [allPoints, innerWidth]);
  const yScale = useMemo(() => {
    const ys = allPoints.map((p) => p.y);
    return scaleLinear()
      .domain([Math.min(0, ...ys), Math.max(1, ...ys)])
      .range([innerHeight, 0])
      .nice();
  }, [allPoints, innerHeight]);

  const dataKey = useMemo(
    () => JSON.stringify(series.map((s) => s.data)),
    [series]
  );
  const popIn = useSpring({
    from: { t: 0 },
    to: { t: 1 },
    config: { tension: 80, friction: 24 }
  });

  const totalPoints = allPoints.length || 1;

  const onMove = (event: React.MouseEvent<SVGRectElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    let best: { seriesIndex: number; pointIndex: number; d2: number } | null =
      null;
    series.forEach((s, si) =>
      s.data.forEach((p, pi) => {
        const dx = xScale(p.x) - px;
        const dy = yScale(p.y) - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < 24 * 24 && (!best || d2 < best.d2))
          best = { seriesIndex: si, pointIndex: pi, d2 };
      })
    );
    setHovered(best);
  };

  const hoveredPoint =
    hovered != null
      ? series[hovered.seriesIndex]?.data[hovered.pointIndex]
      : null;

  const axisText: React.CSSProperties = {
    fontFamily,
    fontSize: 12,
    fill: chrome.axisLabel
  };

  let runningIndex = 0;

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          <YGrid
            yScale={yScale}
            innerWidth={innerWidth}
            formatValue={formatY}
          />
          {xScale.ticks(5).map((tick) => (
            <text
              key={tick}
              x={xScale(tick)}
              y={innerHeight + 20}
              textAnchor="middle"
              style={axisText}
            >
              {formatX(tick)}
            </text>
          ))}
          {xLabel && (
            <text
              x={innerWidth / 2}
              y={innerHeight + 36}
              textAnchor="middle"
              style={{ ...axisText, fontWeight: 600 }}
            >
              {xLabel}
            </text>
          )}
          {yLabel && (
            <text
              transform={`translate(${-40}, ${innerHeight / 2}) rotate(-90)`}
              textAnchor="middle"
              style={{ ...axisText, fontWeight: 600 }}
            >
              {yLabel}
            </text>
          )}

          <g key={dataKey}>
            {series.map((s, si) => {
              const dimmed = activeSeries != null && activeSeries !== s.name;
              return (
                <g
                  key={s.name}
                  opacity={dimmed ? 0.15 : 1}
                  style={{ transition: 'opacity 150ms ease' }}
                >
                  {s.data.map((p, pi) => {
                    const order = runningIndex++;
                    const isHovered =
                      hovered?.seriesIndex === si && hovered?.pointIndex === pi;
                    return (
                      <animated.circle
                        key={pi}
                        cx={xScale(p.x)}
                        cy={yScale(p.y)}
                        r={popIn.t.to((t) => {
                          const local = Math.max(
                            0,
                            Math.min(1, (t * (totalPoints + 6) - order) / 6)
                          );
                          return (isHovered ? 7 : 4.5) * local;
                        })}
                        fill={colorOf(s, si)}
                        // 2px surface ring so overlapping marks stay separable
                        stroke={chrome.surface}
                        strokeWidth={2}
                      />
                    );
                  })}
                </g>
              );
            })}
          </g>

          <rect
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={onMove}
            onMouseLeave={() => setHovered(null)}
          />
        </g>
      </svg>

      {hovered != null && hoveredPoint && (
        <Tooltip
          x={MARGIN.left + xScale(hoveredPoint.x)}
          y={MARGIN.top + yScale(hoveredPoint.y)}
          title={hoveredPoint.label ?? series[hovered.seriesIndex].name}
          rows={[
            {
              label: xLabel ?? 'x',
              value: formatX(hoveredPoint.x),
              color: colorOf(series[hovered.seriesIndex], hovered.seriesIndex)
            },
            { label: yLabel ?? 'y', value: formatY(hoveredPoint.y) }
          ]}
          boundsWidth={width}
        />
      )}
    </div>
  );
};

/**
 * Animated scatter plot. Points pop in with a stagger and the nearest
 * point under the cursor gets a lifted marker + tooltip.
 */
export const ScatterPlot = (props: ScatterPlotProps) => {
  const { series, title, subtitle, footer, flush } = props;
  const [activeSeries, setActiveSeries] = useState<string | null>(null);

  return (
    <ChartCard title={title} subtitle={subtitle} footer={footer} flush={flush}>
      <ParentSize debounceTime={10}>
        {({ width }) =>
          width > 0 ? (
            <ScatterPlotPlot
              {...props}
              key={JSON.stringify(series.map((s) => s.data))}
              width={width}
              activeSeries={activeSeries}
            />
          ) : null
        }
      </ParentSize>
      {series.length >= 2 && (
        <Legend
          items={series.map((s, i) => ({
            label: s.name,
            color: colorOf(s, i)
          }))}
          activeLabel={activeSeries}
          onHover={setActiveSeries}
        />
      )}
    </ChartCard>
  );
};

export default ScatterPlot;
