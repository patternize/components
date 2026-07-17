import React from 'react';
import { BarChart } from './BarChart';

export default {
  title: 'Visualizations/BarChart'
};

export const BarChartStory = () => (
  <BarChart
    title="Bookings by city"
    subtitle="Last 30 days"
    data={[
      { label: 'Tokyo', value: 132 },
      { label: 'Lisbon', value: 118 },
      { label: 'Austin', value: 97 },
      { label: 'Paris', value: 86 },
      { label: 'Seoul', value: 74 },
      { label: 'Oaxaca', value: 51 }
    ]}
  />
);

export const BarChartWithValuesStory = () => (
  <BarChart
    title="Average nightly rate"
    data={[
      { label: 'Entire home', value: 214 },
      { label: 'Private room', value: 96 },
      { label: 'Shared room', value: 54 }
    ]}
    showValues
    formatValue={(v) => `$${v}`}
  />
);

export const BarChartSpotlightStory = () => (
  <BarChart
    title="Response time by team"
    subtitle="The support team is highlighted"
    data={[
      { label: 'Sales', value: 42, color: '#dddddd' },
      { label: 'Support', value: 18 },
      { label: 'Trust', value: 35, color: '#dddddd' },
      { label: 'Payments', value: 29, color: '#dddddd' }
    ]}
    formatValue={(v) => `${v}m`}
  />
);
