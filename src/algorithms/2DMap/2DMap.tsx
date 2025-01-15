import { animated } from '@react-spring/web';
import { useState } from 'react';

// const ROAD_WIDTH = 30; // Width of roads between buildings
const BUILDING_RATIO = 0.6; // Buildings take up 60% of available cell space

interface Position {
  x: number;
  y: number;
}

interface Friend {
  id: string;
  color: string;
  position: Position;
}

interface MapProps {
  width?: number;
  height?: number;
  gridSize: number;
  friends: Friend[];
}

export const CityMap = ({
  width = 500,
  height = 500,
  gridSize = 4,
  friends
}: MapProps) => {
  // Calculate dimensions
  const totalSpace = Math.min(width, height);
  const cellSize = totalSpace / gridSize;
  const buildingSize = cellSize * BUILDING_RATIO;
  const buildingOffset = (cellSize - buildingSize) / 2;

  // Convert grid coordinates to pixel coordinates
  const getPixelPosition = (pos: Position) => ({
    x: pos.x * cellSize + cellSize / 2,
    y: pos.y * cellSize + cellSize / 2
  });

  return (
    <svg width={width} height={height}>
      {/* Draw roads (background) */}
      <rect width={width} height={height} fill="#e8e8e8" />

      {/* Draw buildings */}
      {Array.from({ length: gridSize }).map((_, row) =>
        Array.from({ length: gridSize }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={col * cellSize + buildingOffset}
            y={row * cellSize + buildingOffset}
            width={buildingSize}
            height={buildingSize}
            fill="#FFD700"
            stroke="#ccc"
            strokeWidth={1}
            rx={4} // Rounded corners
          />
        ))
      )}

      {/* Draw friends */}
      {friends.map((friend) => {
        const pixelPos = getPixelPosition(friend.position);
        return (
          <animated.circle
            key={friend.id}
            //@ts-ignore
            r={12}
            fill={friend.color}
            cx={pixelPos.x}
            cy={pixelPos.y}
            opacity={0.8}
            title={friend.id}
          />
        );
      })}

      {/* Draw road lines */}
      {Array.from({ length: gridSize + 1 }).map((_, i) => (
        <g key={`road-lines-${i}`}>
          {/* Horizontal road lines */}
          <line
            x1={0}
            y1={i * cellSize}
            x2={width}
            y2={i * cellSize}
            stroke="#ffffff"
            strokeWidth={2}
            strokeDasharray="8 8"
          />
          {/* Vertical road lines */}
          <line
            x1={i * cellSize}
            y1={0}
            x2={i * cellSize}
            y2={height}
            stroke="#ffffff"
            strokeWidth={2}
            strokeDasharray="8 8"
          />
        </g>
      ))}
    </svg>
  );
};

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
