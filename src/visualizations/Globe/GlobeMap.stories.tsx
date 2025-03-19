import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { GlobeMap } from './GlobeMap';

export default {
  title: 'Visualizations/GlobeMap',
  component: GlobeMap,
  parameters: {
    docs: {
      description: {
        component: `
# GlobeMap Component

This component creates an interactive 3D globe using Mapbox GL.

## Important Note

Due to type declaration differences between versions of react-map-gl, you may encounter TypeScript errors. 
To resolve these:

1. Install type declarations: \`yarn add -D @types/react-map-gl @types/mapbox-gl\`
2. Consider using \`// @ts-ignore\` for persistent type issues or update to a compatible react-map-gl version

A Mapbox access token is required for this component to work properly.
        `
      }
    }
  },
  argTypes: {
    width: { control: 'text' },
    height: { control: 'number' },
    mapboxToken: { control: 'text' },
    enableAnimation: { control: 'boolean' },
    interactiveMarkers: { control: 'boolean' }
  }
} as Meta;

const Template: StoryFn = (args) => <GlobeMap {...args} />;

// Globe with custom styling
export const CustomStyling = Template.bind({});
CustomStyling.args = {
  width: '100%',
  height: 800,
  mapboxToken:
    process.env.STORYBOOK_MAPBOX_TOKEN ||
    'pk.eyJ1IjoiZ2F6Y24wMDciLCJhIjoiY204ZnBvdHY1MGo0dzJrc2Q0d2JhcGYwdCJ9.JBPayAtWDII7oU1qcmvZRA',
  initialViewState: {
    longitude: 0,
    latitude: 20,
    zoom: 1.8
  },
  markers: [
    {
      id: 1,
      longitude: 2.3522,
      latitude: 48.8566,
      color: '#FF5733',
      size: 20,
      name: 'Paris',
      description: 'The City of Light, known for its culture and history.'
    },
    {
      id: 2,
      longitude: 55.2708,
      latitude: 25.2048,
      color: '#FFC300',
      size: 20,
      name: 'Dubai',
      description: 'A global city and business hub of the Middle East.'
    },
    {
      id: 3,
      longitude: 37.6173,
      latitude: 55.7558,
      color: '#DAF7A6',
      size: 20,
      name: 'Moscow',
      description: 'The capital and most populous city of Russia.'
    },
    {
      id: 4,
      longitude: 121.4737,
      latitude: 31.2304,
      color: '#C70039',
      size: 20,
      name: 'Shanghai',
      description: 'A global financial center and transport hub.'
    },
    {
      id: 5,
      longitude: -118.2437,
      latitude: 34.0522,
      color: '#581845',
      size: 20,
      name: 'Los Angeles',
      description: 'The entertainment capital of the world.'
    }
  ],
  enableAnimation: false,
  interactiveMarkers: true,
  onMarkerClick: (marker) => {
    console.log('Marker clicked:', marker);
  }
};
