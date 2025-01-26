import React from 'react';
import ResponsiveWorldMap from './WorldMap';

export default {
  title: 'Visualizations/Map Modules'
};

const daysIHaveSpent = [
  { CHN: 6935 },
  { CAN: 3600 },
  { USA: 150 },
  { CZE: 4 },
  { DEU: 1 },
  { AUT: 10 },
  { THA: 15 },
  { JPN: 20 },
  { ITA: 10 },
  { HUN: 3 },
  { PRK: 3 },
  { AUS: 10 }
];

export const WorldMapStory = () => (
  <ResponsiveWorldMap daysSpent={daysIHaveSpent} />
);

// Add a story with no days spent
export const EmptyWorldMapStory = () => <ResponsiveWorldMap />;
