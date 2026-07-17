import { animated, useSprings } from '@react-spring/web';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleLinear, scalePoint } from 'd3';
import * as React from 'react';
import { chrome, fontFamily, seriesColor } from '../../theme';
import {
  ChartCard,
  Legend,
  thinLabels,
  Tooltip,
  XLabels,
  YGrid
} from '../primitives';

const { useMemo, useState } = React;

export interface LinePoint {
  x: string | number;
  y: number;
}

export interface LineSeries {
  name: string;
  data: LinePoint[];
  /** Optional explicit color; defaults to the next categorical slot. */
  color?: string;
}

export interface LineChartProps {
  series: LineSeries[];
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  height?: number;
  /** Fill under each line (area chart). */
  area?: boolean;
  /** Y-axis tick formatter, also used in the tooltip. */
  formatValue?: (value: number) => string;
  /** Render without the card chrome. */
  flush?: boolean;
}

const MARGIN = { top: 12, right: 16, bottom: 28, left: 48 };
const END_LABEL_GUTTER = 90;

interface PlotProps extends LineChartProps {
  width: number;
  activeSeries: string | null;
}

const LineChartPlot = ({
  series,
  height = 320,
  area = false,
  formatValue = (v) => `${v}`,
  width,
  activeSeries
}: PlotProps) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const directLabels = series.length >= 2 && series.length <= 4;
  const margin = {
    ...MARGIN,
    right: directLabels ? END_LABEL_GUTTER : MARGIN.right
  };
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Shared x categories, in order of first appearance across all series.
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    series.forEach((s) =>
      s.data.forEach((p) => {
        const key = String(p.x);
        if (!seen.has(key)) {
          seen.add(key);
          out.push(key);
        }
      })
    );
    return out;
  }, [series]);

  const xScale = useMemo(
    () => scalePoint<string>().domain(categories).range([0, innerWidth]),
    [categories, innerWidth]
  );

  const yMax = useMemo(
    () => Math.max(1, ...series.flatMap((s) => s.data.map((p) => p.y))),
    [series]
  );
  const yScale = useMemo(
    () => scaleLinear().domain([0, yMax]).range([innerHeight, 0]).nice(),
    [yMax, innerHeight]
  );

  const colorOf = (s: LineSeries, i: number) => s.color ?? seriesColor(i);

  const paths = useMemo(
    () =>
      series.map((s) => {
        const pts = s.data.map((p) => ({
          x: xScale(String(p.x)) ?? 0,
          y: yScale(p.y)
        }));
        const line = pts
          .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
          .join('');
        const fill = pts.length
          ? `${line}L${pts[pts.length - 1].x},${innerHeight}L${pts[0].x},${innerHeight}Z`
          : '';
        return { line, fill, pts };
      }),
    [series, xScale, yScale, innerHeight]
  );

  // Animated draw: pathLength normalizes to 1 and dashoffset springs 1 -> 0.
  // The series <g> is keyed by the data so a data change remounts and redraws.
  const dataKey = useMemo(
    () => JSON.stringify(series.map((s) => s.data)),
    [series]
  );
  const springs = useSprings(
    series.length,
    series.map((_, i) => ({
      from: { dash: 1, fillOpacity: 0 },
      to: { dash: 0, fillOpacity: area ? 0.12 : 0 },
      delay: i * 150,
      config: { tension: 60, friction: 24 }
    }))
  );

  const onMove = (event: React.MouseEvent<SVGRectElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const step = xScale.step() || 1;
    const index = Math.max(
      0,
      Math.min(categories.length - 1, Math.round(px / step))
    );
    setHoverIndex(index);
  };

  const hover =
    hoverIndex != null && categories[hoverIndex] != null
      ? {
          label: categories[hoverIndex],
          x: xScale(categories[hoverIndex]) ?? 0,
          rows: series
            .map((s, i) => {
              const point = s.data.find(
                (p) => String(p.x) === categories[hoverIndex]
              );
              return point
                ? {
                    label: s.name,
                    value: formatValue(point.y),
                    color: colorOf(s, i),
                    y: yScale(point.y)
                  }
                : null;
            })
            .filter((row): row is NonNullable<typeof row> => row != null)
        }
      : null;

  const xLabelItems = thinLabels(
    categories.map((c) => ({ label: c, x: xScale(c) ?? 0 })),
    Math.max(2, Math.floor(innerWidth / 72))
  );

  // De-overlap direct end labels: sort by y and push apart to >= 15px.
  const endLabels = useMemo(() => {
    if (!directLabels) return [];
    const items = series
      .map((s, i) => {
        const pts = paths[i].pts;
        return pts.length
          ? {
              name: s.name,
              x: pts[pts.length - 1].x,
              y: pts[pts.length - 1].y
            }
          : null;
      })
      .filter((item): item is NonNullable<typeof item> => item != null)
      .sort((a, b) => a.y - b.y);
    for (let k = 1; k < items.length; k++) {
      if (items[k].y < items[k - 1].y + 15) items[k].y = items[k - 1].y + 15;
    }
    return items;
  }, [directLabels, series, paths]);

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <YGrid
            yScale={yScale}
            innerWidth={innerWidth}
            formatValue={formatValue}
          />
          <XLabels labels={xLabelItems} y={innerHeight + 20} />

          {series.map((s, i) => {
            const dimmed = activeSeries != null && activeSeries !== s.name;
            return (
              <g
                key={`${s.name}-${dataKey}`}
                opacity={dimmed ? 0.2 : 1}
                style={{ transition: 'opacity 150ms ease' }}
              >
                {area && (
                  <animated.path
                    d={paths[i].fill}
                    fill={colorOf(s, i)}
                    style={{ fillOpacity: springs[i].fillOpacity }}
                  />
                )}
                <animated.path
                  d={paths[i].line}
                  fill="none"
                  stroke={colorOf(s, i)}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  style={{ strokeDashoffset: springs[i].dash }}
                />
              </g>
            );
          })}

          {endLabels.map((item) => (
            <text
              key={item.name}
              x={item.x + 8}
              y={item.y}
              dy="0.32em"
              opacity={
                activeSeries != null && activeSeries !== item.name ? 0.2 : 1
              }
              style={{
                fontFamily,
                fontSize: 12,
                fontWeight: 600,
                fill: chrome.secondaryInk,
                transition: 'opacity 150ms ease'
              }}
            >
              {item.name}
            </text>
          ))}

          {hover && (
            <g>
              <line
                x1={hover.x}
                x2={hover.x}
                y1={0}
                y2={innerHeight}
                stroke={chrome.crosshair}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              {hover.rows.map((row) => (
                <circle
                  key={row.label}
                  cx={hover.x}
                  cy={row.y}
                  r={4.5}
                  fill={row.color}
                  stroke={chrome.surface}
                  strokeWidth={2}
                />
              ))}
            </g>
          )}

          <rect
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={onMove}
            onMouseLeave={() => setHoverIndex(null)}
          />
        </g>
      </svg>

      {hover && (
        <Tooltip
          x={margin.left + hover.x}
          y={margin.top + innerHeight / 2}
          title={hover.label}
          rows={hover.rows}
          boundsWidth={width}
        />
      )}
    </div>
  );
};

/**
 * Animated multi-series line chart. Lines draw in with a stagger, a
 * crosshair + tooltip follows the pointer, and up to four series get
 * direct end labels alongside the legend.
 */
export const LineChart = (props: LineChartProps) => {
  const { series, title, subtitle, footer, flush } = props;
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  // Keying the plot by the data remounts it on data change, restarting the draw animation.
  const dataKey = JSON.stringify(series.map((s) => s.data));

  return (
    <ChartCard title={title} subtitle={subtitle} footer={footer} flush={flush}>
      <ParentSize debounceTime={10}>
        {({ width }) =>
          width > 0 ? (
            <LineChartPlot
              {...props}
              key={dataKey}
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
            color: s.color ?? seriesColor(i)
          }))}
          activeLabel={activeSeries}
          onHover={setActiveSeries}
        />
      )}
    </ChartCard>
  );
};

/** Line chart with the area under each line filled. */
export const AreaChart = (props: LineChartProps) => (
  <LineChart {...props} area />
);

export default LineChart;
