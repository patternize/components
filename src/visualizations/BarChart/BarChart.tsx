import { animated, useSprings } from '@react-spring/web';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleBand, scaleLinear } from 'd3';
import * as React from 'react';
import { chrome, colors, fontFamily } from '../../theme';
import { ChartCard, thinLabels, Tooltip, XLabels, YGrid } from '../primitives';

const { useMemo, useState } = React;

export interface BarDatum {
  label: string;
  value: number;
  /** Optional per-bar color override (e.g. to spotlight one bar). */
  color?: string;
}

export interface BarChartProps {
  data: BarDatum[];
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  height?: number;
  /** Bars are nominal categories, so they share one hue: Rausch by default. */
  color?: string;
  /** Always show value labels above bars (otherwise only on hover). */
  showValues?: boolean;
  formatValue?: (value: number) => string;
  flush?: boolean;
}

const MARGIN = { top: 20, right: 16, bottom: 28, left: 48 };

/** Bar with only its data-end (top) rounded, anchored flat to the baseline. */
function roundedTopBar(
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
): string {
  const r = Math.max(0, Math.min(radius, w / 2, h));
  const bottom = y + h;
  return [
    `M${x},${bottom}`,
    `L${x},${y + r}`,
    `Q${x},${y} ${x + r},${y}`,
    `L${x + w - r},${y}`,
    `Q${x + w},${y} ${x + w},${y + r}`,
    `L${x + w},${bottom}`,
    'Z'
  ].join('');
}

interface PlotProps extends BarChartProps {
  width: number;
}

const BarChartPlot = ({
  data,
  height = 300,
  color = colors.primary,
  showValues = false,
  formatValue = (v) => `${v}`,
  width
}: PlotProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = Math.max(0, height - MARGIN.top - MARGIN.bottom);

  const xScale = useMemo(
    () =>
      scaleBand<string>()
        .domain(data.map((d) => d.label))
        .range([0, innerWidth])
        .paddingInner(0.25)
        .paddingOuter(0.15),
    [data, innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, Math.max(1, ...data.map((d) => d.value))])
        .range([innerHeight, 0])
        .nice(),
    [data, innerHeight]
  );

  const springs = useSprings(
    data.length,
    data.map((d, i) => ({
      from: { t: 0 },
      to: { t: 1 },
      delay: i * 60,
      config: { tension: 170, friction: 26 }
    }))
  );

  const dataKey = useMemo(() => JSON.stringify(data), [data]);
  const bandwidth = xScale.bandwidth();

  const xLabelItems = thinLabels(
    data.map((d) => ({
      label: d.label,
      x: (xScale(d.label) ?? 0) + bandwidth / 2
    })),
    Math.max(2, Math.floor(innerWidth / 64))
  );

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          <YGrid
            yScale={yScale}
            innerWidth={innerWidth}
            formatValue={formatValue}
          />
          <XLabels labels={xLabelItems} y={innerHeight + 20} />

          <g key={dataKey}>
            {data.map((d, i) => {
              const x = xScale(d.label) ?? 0;
              const fullHeight = innerHeight - yScale(d.value);
              const barColor = d.color ?? color;
              const dimmed = hovered != null && hovered !== i;
              return (
                <g key={d.label}>
                  <animated.path
                    d={springs[i].t.to((t) =>
                      roundedTopBar(
                        x,
                        innerHeight - fullHeight * t,
                        bandwidth,
                        fullHeight * t,
                        4
                      )
                    )}
                    fill={barColor}
                    opacity={dimmed ? 0.45 : 1}
                    style={{ transition: 'opacity 150ms ease' }}
                  />
                  {(showValues || hovered === i) && (
                    <animated.text
                      x={x + bandwidth / 2}
                      y={springs[i].t.to(
                        (t) => innerHeight - fullHeight * t - 8
                      )}
                      textAnchor="middle"
                      style={{
                        fontFamily,
                        fontSize: 12,
                        fontWeight: 600,
                        fill: chrome.secondaryInk,
                        fontVariantNumeric: 'tabular-nums'
                      }}
                    >
                      {formatValue(d.value)}
                    </animated.text>
                  )}
                  {/* Hit target wider than the mark itself */}
                  <rect
                    x={x - (xScale.step() - bandwidth) / 2}
                    y={0}
                    width={xScale.step()}
                    height={innerHeight}
                    fill="transparent"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  />
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {hovered != null && data[hovered] && (
        <Tooltip
          x={MARGIN.left + (xScale(data[hovered].label) ?? 0) + bandwidth / 2}
          y={MARGIN.top + yScale(data[hovered].value)}
          title={data[hovered].label}
          rows={[
            {
              label: 'Value',
              value: formatValue(data[hovered].value),
              color: data[hovered].color ?? color
            }
          ]}
          boundsWidth={width}
        />
      )}
    </div>
  );
};

/**
 * Animated bar chart for nominal categories. Bars share one hue (bar
 * length already encodes the value), grow up from the baseline with a
 * stagger, and carry a hover tooltip plus optional direct value labels.
 */
export const BarChart = (props: BarChartProps) => (
  <ChartCard
    title={props.title}
    subtitle={props.subtitle}
    footer={props.footer}
    flush={props.flush}
  >
    <ParentSize debounceTime={10}>
      {({ width }) =>
        width > 0 ? (
          <BarChartPlot
            {...props}
            key={JSON.stringify(props.data)}
            width={width}
          />
        ) : null
      }
    </ParentSize>
  </ChartCard>
);

export default BarChart;
