import type { ScaleLinear } from 'd3';
import * as React from 'react';
import { chrome, fontFamily } from '../../theme';

const tickText: React.CSSProperties = {
  fontFamily,
  fontSize: 12,
  fill: chrome.axisLabel
};

export interface YGridProps {
  yScale: ScaleLinear<number, number>;
  innerWidth: number;
  tickCount?: number;
  formatValue?: (value: number) => string;
}

/**
 * Recessive horizontal gridlines with y tick labels in the left gutter.
 * The zero/bottom line renders as the (slightly stronger) baseline.
 */
export const YGrid = ({
  yScale,
  innerWidth,
  tickCount = 4,
  formatValue = (v) => `${v}`
}: YGridProps) => {
  const [domainMin] = yScale.domain();
  return (
    <g>
      {yScale.ticks(tickCount).map((tick) => (
        <g key={tick} transform={`translate(0, ${yScale(tick)})`}>
          <line
            x1={0}
            x2={innerWidth}
            stroke={tick === domainMin ? chrome.baseline : chrome.gridline}
            strokeWidth={1}
            shapeRendering="crispEdges"
          />
          <text x={-8} dy="0.32em" textAnchor="end" style={tickText}>
            {formatValue(tick)}
          </text>
        </g>
      ))}
    </g>
  );
};

export interface XLabelsProps {
  /** Label → x center position pairs, pre-thinned by the caller. */
  labels: { label: string; x: number }[];
  y: number;
}

/** Muted x-axis labels beneath the plot. */
export const XLabels = ({ labels, y }: XLabelsProps) => (
  <g>
    {labels.map(({ label, x }) => (
      <text
        key={`${label}-${x}`}
        x={x}
        y={y}
        textAnchor="middle"
        style={tickText}
      >
        {label}
      </text>
    ))}
  </g>
);

/** Thin a label list so at most `max` render, always keeping first and last. */
export function thinLabels<T>(items: T[], max: number): T[] {
  if (items.length <= max) return items;
  const step = Math.ceil(items.length / max);
  return items.filter((_, i) => i % step === 0 || i === items.length - 1);
}
