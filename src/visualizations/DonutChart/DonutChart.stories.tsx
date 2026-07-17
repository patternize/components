import React from 'react';
import { DonutChart } from './DonutChart';

export default {
  title: 'Visualizations/DonutChart'
};

export const DonutChartStory = () => (
  <DonutChart
    title="Bookings by property type"
    subtitle="Share of total, last quarter"
    data={[
      { label: 'Entire home', value: 612 },
      { label: 'Private room', value: 284 },
      { label: 'Boutique hotel', value: 133 },
      { label: 'Shared room', value: 41 }
    ]}
    centerLabel="Bookings"
  />
);

export const DonutChartCurrencyStory = () => (
  <DonutChart
    title="Revenue mix"
    data={[
      { label: 'Stays', value: 1840 },
      { label: 'Experiences', value: 460 },
      { label: 'Services', value: 210 }
    ]}
    centerLabel="Total ($k)"
    formatValue={(v) => `$${v}k`}
  />
);
