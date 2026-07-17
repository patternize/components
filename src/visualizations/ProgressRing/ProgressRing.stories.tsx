import React from 'react';
import { colors } from '../../theme';
import { ProgressRing } from './ProgressRing';

export default {
  title: 'Visualizations/ProgressRing'
};

export const ProgressRingStory = () => (
  <ProgressRing value={0.72} label="Occupancy" />
);

export const ProgressRingRowStory = () => (
  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
    <ProgressRing value={0.72} label="Occupancy" />
    <ProgressRing value={0.94} label="Response rate" color="#00a699" />
    <ProgressRing value={0.31} label="Superhosts" color={colors.luxe} />
  </div>
);
