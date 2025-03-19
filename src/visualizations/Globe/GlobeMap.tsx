// @ts-ignore - Type declarations for react-map-gl may vary between versions
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useState } from 'react';
// Import from specific subpath as required by react-map-gl v8+
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/mapbox';
import './GlobeMap.css';

// Define the prop types for the GlobeMap component
interface MarkerData {
  id: string | number;
  longitude: number;
  latitude: number;
  size?: number;
  color?: string;
  name?: string;
  description?: string;
}

interface GlobeMapProps {
  width?: string | number;
  height?: string | number;
  mapboxToken?: string;
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
    bearing?: number;
    pitch?: number;
  };
  markers?: MarkerData[];
  onMarkerClick?: (marker: MarkerData) => void;
  enableAnimation?: boolean;
  interactiveMarkers?: boolean;
}

export function GlobeMap({
  width = '100%',
  height = 500,
  mapboxToken = 'YOUR_MAPBOX_TOKEN', // Replace with your actual token when using
  initialViewState = {
    longitude: 0,
    latitude: 0,
    zoom: 1
  },
  markers = [],
  onMarkerClick,
  enableAnimation = false,
  interactiveMarkers = true
}: GlobeMapProps) {
  const [viewState, setViewState] = useState(initialViewState);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  // Handle marker click
  const handleMarkerClick = useCallback(
    (marker: MarkerData) => {
      setSelectedMarker(marker);
      if (onMarkerClick) {
        onMarkerClick(marker);
      }
    },
    [onMarkerClick]
  );

  // Close popup when clicking on the map
  const handleMapClick = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  // Add auto-rotation effect if enabled
  useEffect(() => {
    if (!enableAnimation) return;

    const rotationInterval = setInterval(() => {
      setViewState((prev) => ({
        ...prev,
        longitude: (prev.longitude + 0.1) % 360
      }));
    }, 50);

    return () => clearInterval(rotationInterval);
  }, [enableAnimation]);

  return (
    <div style={{ width, height, position: 'relative' }}>
      {/* @ts-ignore - Using @ts-ignore to bypass type issues with react-map-gl */}
      <Map
        {...viewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v9"
        mapboxAccessToken={mapboxToken}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        projection="globe"
        attributionControl={false}
        fog={{
          color: 'rgb(180, 53, 157)',
          'high-color': 'rgb(137, 150, 180)',
          'horizon-blend': 0.1,
          'space-color': 'rgb(168, 168, 171)',
          'star-intensity': 0.7
        }}
      >
        {/* Navigation control */}
        <NavigationControl />

        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
          >
            <div
              className={`globe-map-marker ${selectedMarker?.id === marker.id ? 'selected' : ''}`}
              style={{
                width: marker.size ? `${marker.size}px` : undefined,
                height: marker.size ? `${marker.size}px` : undefined,
                backgroundColor: marker.color || undefined
              }}
              onClick={
                interactiveMarkers ? () => handleMarkerClick(marker) : undefined
              }
            />
          </Marker>
        ))}

        {/* Popup for selected marker */}
        {selectedMarker && interactiveMarkers && (
          <Popup
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            onClose={() => setSelectedMarker(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="globe-map-popup">
              {selectedMarker.name && (
                <h3 className="globe-map-popup-title">{selectedMarker.name}</h3>
              )}
              {selectedMarker.description && (
                <p className="globe-map-popup-description">
                  {selectedMarker.description}
                </p>
              )}
              <div className="globe-map-popup-coordinates">
                {selectedMarker.latitude.toFixed(4)},{' '}
                {selectedMarker.longitude.toFixed(4)}
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Controls overlay */}
      {/* <div className="globe-map-controls">
        <div>Longitude: {viewState.longitude.toFixed(2)}°</div>
        <div>Latitude: {viewState.latitude.toFixed(2)}°</div>
        <div>Zoom: {viewState.zoom.toFixed(1)}x</div>
      </div> */}
    </div>
  );
}

export default GlobeMap;
