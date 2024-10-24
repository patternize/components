import { Graticule, Mercator } from '@visx/geo';
import { scaleLog } from '@visx/scale';
import * as topojson from 'topojson-client';
import topology from './world-topo.json';

export const background = '#f9f7e8';

export type GeoMercatorProps = {
  width: number;
  height: number;
  events?: boolean;
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

export default function ({ width, height, events = false }: GeoMercatorProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width / 630) * 100;

  return width < 10 ? null : (
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
        scale={scale}
        translate={[centerX, centerY + 50]}
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
              return (
                <path
                  key={`map-feature-${i}`}
                  d={path || ''}
                  fill={fillColor}
                  stroke={background}
                  strokeWidth={0.5}
                  onClick={() => {
                    if (events)
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
}
