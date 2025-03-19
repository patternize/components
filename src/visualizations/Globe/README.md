# GlobeMap Component

An interactive 3D globe visualization component using Mapbox GL and react-map-gl.

## Features

- Interactive 3D globe with pan, tilt, and zoom
- Customizable markers with popups
- Auto-rotation feature
- Animated "bounce cards" that appear when markers are clicked
- Dark styling with space/atmosphere effect
- Responsive design with mobile support

## Installation

Make sure to install the required dependencies:

```bash
yarn add react-map-gl mapbox-gl @turf/turf
yarn add -D @types/react-map-gl @types/mapbox-gl
```

## Import Notes for react-map-gl v8+

If you're using react-map-gl version 8 or higher, you need to import from specific subpaths:

```jsx
// For Mapbox GL:
import Map from 'react-map-gl/mapbox';
import { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';

// For MapLibre GL:
import Map from 'react-map-gl/maplibre';
import { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre';
```

## Usage

```jsx
import { GlobeMap } from '@patternize/components';

function App() {
  return (
    <GlobeMap
      mapboxToken="YOUR_MAPBOX_TOKEN"
      height={600}
      markers={[
        {
          id: 1,
          longitude: -122.4194, 
          latitude: 37.7749,
          color: "#61dafb",
          size: 16,
          name: "San Francisco",
          description: "Tech hub of the West Coast"
        }
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | string \| number | '100%' | Width of the map container |
| `height` | number | 500 | Height of the map container in pixels |
| `mapboxToken` | string | 'YOUR_MAPBOX_TOKEN' | Your Mapbox access token |
| `initialViewState` | object | `{ longitude: 0, latitude: 0, zoom: 1 }` | Initial view state of the map |
| `markers` | array | [] | Array of marker objects to display on the map |
| `onMarkerClick` | function | undefined | Callback function that fires when a marker is clicked |
| `enableAnimation` | boolean | true | Whether to enable auto-rotation of the globe |
| `interactiveMarkers` | boolean | true | Whether markers can be clicked to show popups |
| `showBounceCards` | boolean | true | Whether to show animated bounce cards when a marker is clicked |

## Marker Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string \| number | Unique identifier for the marker |
| `longitude` | number | Longitude coordinate for the marker |
| `latitude` | number | Latitude coordinate for the marker |
| `size` | number | (Optional) Size of the marker in pixels |
| `color` | string | (Optional) Color of the marker |
| `name` | string | (Optional) Name to display in the popup |
| `description` | string | (Optional) Description to display in the popup |
| `images` | string[] | (Optional) Array of image URLs to display in bounce cards when the marker is clicked |

## Type Issues

If you encounter TypeScript errors related to react-map-gl, you have several options:

1. Add `// @ts-ignore` comments to bypass type-checking for specific lines
2. Ensure you're using compatible versions of react-map-gl and mapbox-gl
3. Reference the react-map-gl documentation for your specific version

## Common Issues

- **Module not found error**: If you see an error like "Package path . is not exported from package react-map-gl", you need to update your imports to use specific subpaths (see Import Notes section above).
- **Property does not exist errors**: The react-map-gl API has changed significantly between versions. Check the documentation for your specific version.

## Notes

- Requires a valid Mapbox token (get one at [mapbox.com](https://www.mapbox.com/))
- The globe projection feature requires react-map-gl version 7.0.0 or higher 