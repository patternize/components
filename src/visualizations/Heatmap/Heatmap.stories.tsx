import React from 'react';
import { Heatmap } from './Heatmap';

export default {
  title: 'Visualizations/Heatmap'
};

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'];

// Deterministic demo matrix: weekend evenings run hottest.
const values = days.map((_, r) =>
  hours.map((_, c) => {
    const weekend = r >= 5 ? 24 : 0;
    const evening = c >= 6 ? 18 : c >= 3 ? 8 : 0;
    const wave = Math.round(
      10 + 8 * Math.sin(r * 1.3 + c * 0.7) + weekend + evening
    );
    return Math.max(0, wave);
  })
);

export const HeatmapStory = () => (
  <Heatmap
    title="Booking requests by hour"
    subtitle="Darker = more requests"
    rows={days}
    columns={hours}
    values={values}
  />
);

export const HeatmapWithValuesStory = () => (
  <Heatmap
    title="Search volume"
    rows={days.slice(0, 5)}
    columns={hours.slice(0, 6)}
    values={values.slice(0, 5).map((r) => r.slice(0, 6))}
    showValues
    cellSize={40}
    ramp="rausch"
  />
);
