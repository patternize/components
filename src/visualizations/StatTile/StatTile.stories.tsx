import React from 'react';
import { StatRow, StatTile } from './StatTile';

export default {
  title: 'Visualizations/StatTile'
};

export const StatTileStory = () => (
  <StatTile
    label="Nights booked"
    value={12840}
    delta={12.5}
    deltaLabel="vs last month"
  />
);

export const StatRowStory = () => (
  <StatRow>
    <StatTile
      label="Revenue"
      value={48200}
      prefix="$"
      delta={8.3}
      deltaLabel="vs last month"
    />
    <StatTile
      label="Occupancy"
      value={87.4}
      decimals={1}
      suffix="%"
      delta={2.1}
      deltaLabel="vs last month"
    />
    <StatTile
      label="Cancellations"
      value={142}
      delta={5.7}
      deltaLabel="vs last month"
      positiveIsGood={false}
    />
    <StatTile
      label="Avg rating"
      value={4.81}
      decimals={2}
      delta={-0.4}
      deltaLabel="vs last month"
    />
  </StatRow>
);
