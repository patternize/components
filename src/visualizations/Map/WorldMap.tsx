import { Graticule, Mercator } from '@visx/geo';
import { ParentSize } from '@visx/responsive';
import { scaleLog } from '@visx/scale';
import { useState } from 'react';
import * as topojson from 'topojson-client';
import topology from './world-topo.json';

export const background = '#f9f7e8';

export type GeoMercatorProps = {
  width: number;
  height: number;
};

interface FeatureShape {
  type: 'Feature';
  id: string;
  geometry: { coordinates: [number, number][][]; type: 'Polygon' };
  properties: { name: string };
}

const world = topojson.feature(topology, topology.objects.units) as {
  type: 'FeatureCollection';
  features: FeatureShape[];
};

const daysIHaveSpent = [
  { CHN: 6935 },
  { CAN: 3600 },
  { USA: 150 },
  { CZE: 4 },
  { DEU: 1 },
  { AUT: 10 },
  { THA: 10 },
  { JPN: 20 },
  { ITA: 10 },
  { HUN: 3 },
  { PRK: 3 }
];

// Create a map for easy lookup
const daysMap = daysIHaveSpent.reduce(
  (acc, obj) => {
    const [country, days] = Object.entries(obj)[0];
    acc[country] = days;
    return acc;
  },
  {} as Record<string, number>
);

const maxDays = Math.max(...Object.values(daysMap));

const color = scaleLog({
  domain: [1, maxDays],
  range: ['#ffb01d', '#f63a48']
});

export const WorldMap = ({ width, height }: GeoMercatorProps) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={background}
        rx={14}
      />
      <Mercator<FeatureShape>
        data={world.features}
        scale={(width / 630) * 100} // Adjusted scale based on width
        translate={[width / 2, height / 2 + 50]}
      >
        {(mercator) => (
          <g>
            <Graticule
              graticule={(g) => mercator.path(g) || ''}
              stroke="rgba(33,33,33,0.05)"
            />
            {mercator.features.map(({ feature, path }, i) => {
              const country = feature.id;
              const daysSpent = daysMap[country];
              const fillColor = daysSpent ? color(daysSpent) : '#cccccc'; // Grey for unvisited
              const isHovered = hoveredCountry === country;
              // Brighten the fill color for hovered country
              const brightenedFillColor =
                isHovered && !daysSpent
                  ? `rgba(155, 155, 155, 0.9)`
                  : fillColor;
              return (
                <path
                  key={`map-feature-${i}`}
                  d={path || ''}
                  fill={brightenedFillColor}
                  stroke={background}
                  strokeWidth={0.5}
                  onMouseEnter={() => setHoveredCountry(country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => {
                    alert(`Clicked: ${country} (${feature.properties.name})`);
                  }}
                />
              );
            })}
          </g>
        )}
      </Mercator>
    </svg>
  );
};

export default function ResponsiveWorldMap() {
  return (
    <ParentSize debounceTime={10}>
      {({ width = 1000, height = 500 }) => {
        const maxHeight = 500;
        const maxWidth = 1000;
        const h = Math.min(height, maxHeight);
        const w = Math.min(width, maxWidth);
        return <WorldMap width={w || maxWidth} height={h || maxHeight} />;
      }}
    </ParentSize>
  );
}
