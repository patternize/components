import React from 'react';
import { ScatterPlot } from './ScatterPlot';

export default {
  title: 'Visualizations/ScatterPlot'
};

// Deterministic pseudo-random spread so stories render stably.
const spread = (seed: number, n: number, cx: number, cy: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = Math.sin(seed * 997 + i * 131) * 43758.5453;
    const b = Math.sin(seed * 761 + i * 197) * 24634.6345;
    return {
      x: cx + (a - Math.floor(a) - 0.5) * 40,
      y: cy + (b - Math.floor(b) - 0.5) * 30
    };
  });

export const ScatterPlotStory = () => (
  <ScatterPlot
    title="Rate vs occupancy"
    subtitle="Each point is a listing"
    xLabel="Nightly rate ($)"
    yLabel="Occupancy (%)"
    series={[
      { name: 'Urban', data: spread(1, 24, 140, 72) },
      { name: 'Beach', data: spread(2, 24, 220, 58) },
      { name: 'Mountain', data: spread(3, 24, 90, 44) }
    ]}
    formatX={(v) => `$${Math.round(v)}`}
    formatY={(v) => `${Math.round(v)}%`}
  />
);

const scores = Array.from({ length: 40 }, (_, i) => {
  const a = Math.sin(4 * 997 + i * 131) * 43758.5453;
  const b = Math.sin(4 * 761 + i * 197) * 24634.6345;
  return {
    x: 80 + (a - Math.floor(a)) * 220,
    y: 3.6 + (b - Math.floor(b)) * 1.4
  };
});

export const SingleSeriesScatterStory = () => (
  <ScatterPlot
    title="Review score vs price"
    xLabel="Price ($)"
    yLabel="Score"
    series={[{ name: 'Listings', data: scores }]}
    formatX={(v) => `$${Math.round(v)}`}
    formatY={(v) => v.toFixed(1)}
  />
);
