import { animated } from '@react-spring/web';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useState } from 'react';

const styles = `
  @keyframes drawPath {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes flowPath {
    from {
      stroke-dasharray: 12 24;
      stroke-dashoffset: 36;
    }
    to {
      stroke-dasharray: 12 24;
      stroke-dashoffset: 0;
    }
  }
`;

const BUILDING_RATIO = 0.6; // Buildings take up 60% of available cell space

interface Position {
  x: number;
  y: number;
}

interface Friend {
  id: string;
  color: string;
  position: Position;
  destination?: Position;
}

interface MapProps {
  width?: number;
  height?: number;
  gridSize: number;
  friends: Friend[];
}

interface CityMapProps extends MapProps {
  maxWidth?: number;
  maxHeight?: number;
}

function CityMapDiagram({
  width = 500,
  height = 500,
  gridSize = 4,
  friends
}: MapProps) {
  const padding = 20;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const totalSpace = Math.min(innerWidth, innerHeight);
  const cellSize = totalSpace / gridSize;
  const buildingSize = cellSize * BUILDING_RATIO;
  const buildingOffset = (cellSize - buildingSize) / 2;

  const getPixelPosition = (pos: Position) => ({
    x: padding + pos.x * cellSize,
    y: padding + pos.y * cellSize
  });

  const getManhattanPath = (start: Position, end: Position) => {
    const startPixel = getPixelPosition(start);
    const endPixel = getPixelPosition(end);

    return `M ${startPixel.x} ${startPixel.y} 
            H ${endPixel.x} 
            V ${endPixel.y}`;
  };

  const getPathLength = (start: Position, end: Position) => {
    const startPixel = getPixelPosition(start);
    const endPixel = getPixelPosition(end);
    return (
      Math.abs(endPixel.x - startPixel.x) + Math.abs(endPixel.y - startPixel.y)
    );
  };

  // Add helper function to calculate Manhattan distance
  const getManhattanDistance = (start: Position, end: Position) => {
    return Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
  };

  // Update helper to get label position based on path direction
  const getLabelPosition = (start: Position, end: Position) => {
    const startPixel = getPixelPosition(start);
    const endPixel = getPixelPosition(end);
    const isMovingRight = endPixel.x > startPixel.x;
    const isMovingDown = endPixel.y > startPixel.y;

    return {
      x: startPixel.x + (isMovingRight ? 30 : -30), // Right of origin if moving right, left if moving left
      y: startPixel.y + (isMovingDown ? 20 : -20) // Below origin if moving down, above if moving up
    };
  };

  return (
    <svg width={width} height={height}>
      <style>{styles}</style>
      {/* Draw roads (background) */}
      <rect width={width} height={height} fill="#e8e8e8" />

      {/* Draw buildings */}
      {Array.from({ length: gridSize }).map((_, row) =>
        Array.from({ length: gridSize }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={padding + col * cellSize + buildingOffset}
            y={padding + row * cellSize + buildingOffset}
            width={buildingSize}
            height={buildingSize}
            fill="#FFD700"
            stroke="#ccc"
            strokeWidth={1}
            rx={4}
          />
        ))
      )}

      {/* Draw road lines */}
      {Array.from({ length: gridSize + 1 }).map((_, i) => (
        <g key={`road-lines-${i}`}>
          {/* Horizontal road lines */}
          <line
            x1={padding}
            y1={padding + i * cellSize}
            x2={padding + totalSpace}
            y2={padding + i * cellSize}
            stroke="#ffffff"
            strokeWidth={2}
            strokeDasharray="8 8"
          />
          {/* Vertical road lines */}
          <line
            x1={padding + i * cellSize}
            y1={padding}
            x2={padding + i * cellSize}
            y2={padding + totalSpace}
            stroke="#ffffff"
            strokeWidth={2}
            strokeDasharray="8 8"
          />
        </g>
      ))}

      {/* Draw Manhattan paths with labels */}
      {friends.map((friend) => {
        if (friend.destination) {
          const pathLength = getPathLength(friend.position, friend.destination);
          const pathKey = `path-${friend.id}-${friend.destination.x}-${friend.destination.y}`;
          const distance = getManhattanDistance(
            friend.position,
            friend.destination
          );
          const labelPos = getLabelPosition(
            friend.position,
            friend.destination
          );

          return (
            <g key={pathKey}>
              {/* Solid base path */}
              <path
                d={getManhattanPath(friend.position, friend.destination)}
                stroke={friend.color}
                strokeWidth={8}
                fill="none"
                opacity={0.4}
                style={{
                  strokeDasharray: pathLength,
                  strokeDashoffset: pathLength,
                  animation: 'drawPath 1s ease forwards'
                }}
              />
              {/* Flowing overlay path */}
              <path
                d={getManhattanPath(friend.position, friend.destination)}
                stroke={friend.color}
                strokeWidth={8}
                fill="none"
                opacity={0.2}
                style={{
                  animation: 'flowPath 1s linear infinite'
                }}
              />
              {/* Distance label with background */}
              <rect
                x={labelPos.x - 15}
                y={labelPos.y - 15}
                width={30}
                height={20}
                fill="white"
                rx={4}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                fill={friend.color}
                fontSize={14}
                fontWeight="bold"
                style={{
                  animation: 'drawPath 1s ease forwards'
                }}
              >
                {distance}
              </text>
            </g>
          );
        }
        return null;
      })}

      {/* Draw friends with labels */}
      {friends.map((friend) => {
        const pixelPos = getPixelPosition(friend.position);
        return (
          <g key={friend.id}>
            <animated.circle
              //@ts-ignore
              r={12}
              fill={friend.color}
              cx={pixelPos.x}
              cy={pixelPos.y}
              opacity={0.8}
              title={friend.id}
            />
            <text
              x={pixelPos.x}
              y={pixelPos.y - 16}
              textAnchor="middle"
              fill={friend.color}
              fontSize={14}
              fontWeight="bold"
              dy="-4"
            >
              {friend.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function CityMap({
  maxWidth = 800,
  maxHeight = 800,
  ...props
}: CityMapProps) {
  return (
    <ParentSize debounceTime={10}>
      {({ width = 500, height = 500 }) => {
        const h = Math.min(height, maxHeight);
        const w = Math.min(width, maxWidth);
        return (
          <CityMapDiagram
            {...props}
            width={w || maxWidth}
            height={h || maxHeight}
          />
        );
      }}
    </ParentSize>
  );
}

interface AnimatedMapProps extends MapProps {
  steps: Array<Friend[]>;
  onComplete?: () => void;
}

export const AnimatedCityMap = ({
  steps,
  width = 500,
  height = 500,
  gridSize = 4,
  onComplete
}: AnimatedMapProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [friends, setFriends] = useState(steps[0]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setFriends(steps[currentStep + 1]);
    } else if (onComplete) {
      onComplete();
    }
  };

  return (
    <div>
      <CityMap
        width={width}
        height={height}
        gridSize={gridSize}
        friends={friends}
      />
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={handleNextStep}
          disabled={currentStep === steps.length - 1}
        >
          Next Step
        </button>
      </div>
    </div>
  );
};
