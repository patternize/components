import React from 'react';
import { CycleFlow } from './CycleFlow';

export default {
  title: 'Visualization/CycleFlow',
  component: CycleFlow
};

export const DatingCycle = () => (
  <div style={{ width: '600px', height: '600px' }}>
    <CycleFlow
      width={600}
      height={600}
      edges={[
        {
          source: 'More engaged user',
          target: 'Successful date',
          label: 'leads to',
          color: '#4CAF50'
        },
        {
          source: 'Successful date',
          target: 'Match with someone',
          label: 'encourages',
          color: '#4CAF50'
        },
        {
          source: 'Match with someone',
          target: 'More engaged user',
          label: '❌ becomes',
          // color: 'red',
          animated: false
        }
      ]}
      nodes={[
        { id: 'More engaged user', color: '#4CAF50' },
        { id: 'Successful date', color: '#2196F3' },
        { id: 'Match with someone', color: '#FF5722' }
      ]}
    />
  </div>
);

export const EconomicCycle = () => (
  <div style={{ width: '700px', height: '700px', background: '#f9f9f9' }}>
    <CycleFlow
      width={700}
      height={700}
      edges={[
        {
          source: 'Households',
          target: 'Firms',
          label: 'Consumption spending\n(300 billion pesos)',
          color: '#90A4AE'
        },
        {
          source: 'Firms',
          target: 'Households',
          label: 'Wage income\n(300 billion pesos)',
          color: '#90A4AE'
        }
      ]}
      nodes={[
        { id: 'Households', color: '#2E7D32' }, // Dark green
        { id: 'Firms', color: '#C62828' } // Dark red
      ]}
    />
  </div>
);

export const SimpleExample = () => (
  <div style={{ width: '400px', height: '400px' }}>
    <CycleFlow
      edges={[
        { source: 'A', target: 'B', label: 'Step 1' },
        { source: 'B', target: 'C', label: 'Step 2' },
        { source: 'C', target: 'A', label: 'Step 3' }
      ]}
      // No node colors specified - will use defaults
    />
  </div>
);

export const CustomAnimations = () => (
  <div style={{ width: '600px', height: '600px', background: '#f5f5f5' }}>
    <CycleFlow
      width={600}
      height={600}
      edges={[
        {
          source: 'Process A',
          target: 'Process B',
          label: 'Normal flow',
          animated: true
        },
        {
          source: 'Process B',
          target: 'Process C',
          label: 'Static connection',
          animated: false,
          color: '#E91E63'
        },
        {
          source: 'Process C',
          target: 'Process D',
          label: 'Colored flow',
          color: '#9C27B0'
        },
        {
          source: 'Process D',
          target: 'Process A',
          label: 'Default flow'
        }
      ]}
      nodes={[
        { id: 'Process A', color: '#3F51B5' },
        { id: 'Process B', color: '#009688' },
        { id: 'Process C', color: '#FFC107' },
        { id: 'Process D', color: '#607D8B' }
      ]}
    />
  </div>
);
