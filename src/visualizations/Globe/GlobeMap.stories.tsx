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
    interactiveMarkers: { control: 'boolean' },
    showBounceCards: { control: 'boolean' }
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
      longitude: 14.4378,
      latitude: 50.0755,
      color: '#FF5733',
      size: 20,
      name: 'Prague',
      description:
        'The capital city of the Czech Republic, I visited October 2024',
      images: [
        'https://carlrocks.com/assets/images/prague-4b46d4acfffd32f16965b4d2be2a210a.jpg', // Mountain landscape
        'https://carlrocks.com/assets/images/prague2-7cfa719e695cf5a70189a1f04e962fcb.jpg', // River and forest
        'https://carlrocks.com/assets/images/bridge2-97fdff535d74995897b5e2af59f9e023.jpg', // Nature landscape
        'https://carlrocks.com/assets/images/clock2-c6eb3e18a6a8197c40941e3fba671db2.jpg', // Mountain and lake
        'https://carlrocks.com/assets/images/church-842d95a972602c9b593446e924fc8eb0.JPG' // Birds on a branch
      ]
    },
    {
      id: 2,
      longitude: 55.2708,
      latitude: 25.2048,
      color: '#FFC300',
      size: 20,
      name: 'Dubai',
      description: 'A global city and business hub of the Middle East.',
      images: [
        'https://picsum.photos/id/1011/600/600', // Girl with a camera
        'https://picsum.photos/id/1012/600/600', // Person looking at mountains
        'https://picsum.photos/id/1027/600/600', // Man in the desert
        'https://picsum.photos/id/1035/600/600', // Desert landscape
        'https://picsum.photos/id/1039/600/600' // City skyline
      ]
    },
    {
      id: 3,
      longitude: 37.6173,
      latitude: 55.7558,
      color: '#DAF7A6',
      size: 20,
      name: 'Moscow',
      description: 'The capital and most populous city of Russia.',
      images: [
        'https://picsum.photos/id/1047/600/600', // Town or village
        'https://picsum.photos/id/1044/600/600', // Interior architecture
        'https://picsum.photos/id/1040/600/600', // Castle on a hill
        'https://picsum.photos/id/1041/600/600', // Aerial view of a coast
        'https://picsum.photos/id/1043/600/600' // Child and pup in a boat
      ]
    },
    {
      id: 4,
      longitude: 121.4737,
      latitude: 31.2304,
      color: '#C70039',
      size: 20,
      name: 'Shanghai',
      description: 'A global financial center and transport hub.',
      images: [
        'https://picsum.photos/id/1053/600/600', // Brick building
        'https://picsum.photos/id/1055/600/600', // Office building
        'https://picsum.photos/id/1061/600/600', // Car close-up
        'https://picsum.photos/id/1067/600/600', // Urban street
        'https://picsum.photos/id/1076/600/600' // Concrete building
      ]
    },
    {
      id: 5,
      longitude: -118.2437,
      latitude: 34.0522,
      color: '#581845',
      size: 20,
      name: 'Los Angeles',
      description: 'The entertainment capital of the world.',
      images: [
        'https://picsum.photos/id/1001/600/600', // Urban street
        'https://picsum.photos/id/1002/600/600', // Open book
        'https://picsum.photos/id/1003/600/600', // Deer in nature
        'https://picsum.photos/id/1004/600/600', // Person on cliff
        'https://picsum.photos/id/1005/600/600' // People at the beach
      ]
    }
  ],
  enableAnimation: false,
  interactiveMarkers: true,
  showBounceCards: true,
  onMarkerClick: (marker) => {
    console.log('Marker clicked:', marker);
  }
};

// Animation enabled
export const WithAnimation = Template.bind({});
WithAnimation.args = {
  ...CustomStyling.args,
  enableAnimation: true,
  showBounceCards: false
};

// Without bounce cards
export const WithoutBounceCards = Template.bind({});
WithoutBounceCards.args = {
  ...CustomStyling.args,
  showBounceCards: false
};
