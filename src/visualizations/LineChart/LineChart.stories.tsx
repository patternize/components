import React from 'react';
import { AreaChart, LineChart } from './LineChart';

export default {
  title: 'Visualizations/LineChart'
};

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const bookings = [42, 48, 61, 74, 89, 112, 134, 141, 118, 95, 68, 55];
const revenue = [30, 35, 47, 60, 78, 98, 121, 128, 104, 80, 52, 41];
const occupancy = [51, 55, 63, 70, 82, 95, 108, 112, 96, 84, 64, 57];

export const SingleLineStory = () => (
  <LineChart
    title="Nights booked"
    subtitle="Monthly totals, 2025"
    series={[
      { name: 'Nights', data: months.map((m, i) => ({ x: m, y: bookings[i] })) }
    ]}
  />
);

export const MultiLineStory = () => (
  <LineChart
    title="Listings performance"
    subtitle="Three markets, monthly"
    series={[
      { name: 'Tokyo', data: months.map((m, i) => ({ x: m, y: bookings[i] })) },
      { name: 'Lisbon', data: months.map((m, i) => ({ x: m, y: revenue[i] })) },
      {
        name: 'Austin',
        data: months.map((m, i) => ({ x: m, y: occupancy[i] }))
      }
    ]}
    footer="Source: internal bookings pipeline"
  />
);

export const AreaChartStory = () => (
  <AreaChart
    title="Weekly active guests"
    series={[
      {
        name: 'Guests',
        data: months.map((m, i) => ({ x: m, y: occupancy[i] }))
      }
    ]}
    formatValue={(v) => `${v}k`}
  />
);

export const MultiAreaStory = () => (
  <AreaChart
    title="Demand vs supply"
    series={[
      {
        name: 'Demand',
        data: months.map((m, i) => ({ x: m, y: bookings[i] }))
      },
      { name: 'Supply', data: months.map((m, i) => ({ x: m, y: revenue[i] })) }
    ]}
  />
);
