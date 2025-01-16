import { useState } from 'react';
import Button from '../../components/Button';
import { CityMap } from './ManhattanDistance';

export default {
  title: 'Algorithms/Manhattan Distance'
};
const FRIENDS = [
  {
    id: 'A',
    color: '#26deb0',
    position: { x: 5, y: 4 }
  },
  {
    id: 'B',
    color: '#ff9f1c',
    position: { x: 3, y: 1 }
  },
  {
    id: 'C',
    color: '#6772e5',
    position: { x: 1, y: 3 }
  },
  {
    id: 'D',
    color: '#ed5565',
    position: { x: 6, y: 6 }
  },
  {
    id: 'E',
    color: '#9c27b0', // Purple
    position: { x: 2, y: 5 }
  },
  {
    id: 'F',
    color: '#2196f3', // Blue
    position: { x: 4, y: 2 }
  }
];

export const StaticMapStory = () => <CityMap gridSize={6} friends={FRIENDS} />;
export const ManhattanDistanceOptimizedStory = () => {
  const getManhattanDistance = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    return Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
  };

  const MOVEMENT_STEPS: any = [
    // Initial positions - no destinations
    FRIENDS,
    // All to Top Left (0,0)
    [
      { ...FRIENDS[0], destination: { x: 0, y: 0 } },
      { ...FRIENDS[1], destination: { x: 0, y: 0 } },
      { ...FRIENDS[2], destination: { x: 0, y: 0 } },
      { ...FRIENDS[3], destination: { x: 0, y: 0 } },
      { ...FRIENDS[4], destination: { x: 0, y: 0 } },
      { ...FRIENDS[5], destination: { x: 0, y: 0 } }
    ],
    // All to Top Right (6,0)
    [
      { ...FRIENDS[0], destination: { x: 6, y: 0 } },
      { ...FRIENDS[1], destination: { x: 6, y: 0 } },
      { ...FRIENDS[2], destination: { x: 6, y: 0 } },
      { ...FRIENDS[3], destination: { x: 6, y: 0 } },
      { ...FRIENDS[4], destination: { x: 6, y: 0 } },
      { ...FRIENDS[5], destination: { x: 6, y: 0 } }
    ],
    // All to Bottom Left (0,6)
    [
      { ...FRIENDS[0], destination: { x: 0, y: 6 } },
      { ...FRIENDS[1], destination: { x: 0, y: 6 } },
      { ...FRIENDS[2], destination: { x: 0, y: 6 } },
      { ...FRIENDS[3], destination: { x: 0, y: 6 } },
      { ...FRIENDS[4], destination: { x: 0, y: 6 } },
      { ...FRIENDS[5], destination: { x: 0, y: 6 } }
    ],
    // All to Bottom Right (6,6)
    [
      { ...FRIENDS[0], destination: { x: 6, y: 6 } },
      { ...FRIENDS[1], destination: { x: 6, y: 6 } },
      { ...FRIENDS[2], destination: { x: 6, y: 6 } },
      { ...FRIENDS[3], destination: { x: 6, y: 6 } },
      { ...FRIENDS[4], destination: { x: 6, y: 6 } },
      { ...FRIENDS[5], destination: { x: 6, y: 6 } }
    ],
    // Final summary step - show B->D and C->D paths
    FRIENDS.map((friend) => {
      if (friend.id === 'B') {
        return {
          ...friend,
          destination: FRIENDS[3].position,
          color: '#26deb0'
        }; // Green path from B to D
      }
      if (friend.id === 'C') {
        return {
          ...friend,
          destination: FRIENDS[3].position,
          color: '#26deb0'
        }; // Green path from C to D
      }
      return { ...friend };
    })
  ];

  const [step, setStep] = useState(0);
  const [friends, setFriends] = useState(MOVEMENT_STEPS[0]);
  const getStepDescription = (stepIndex: number) => {
    if (stepIndex === 0) {
      // Calculate distances to corners
      const corners = [
        { x: 0, y: 0 }, // Top left
        { x: 6, y: 0 }, // Top right
        { x: 0, y: 6 }, // Bottom left
        { x: 6, y: 6 } // Bottom right
      ];

      let maxDist = 0;
      let maxFriend = '';
      let maxCorner = '';

      for (const friend of FRIENDS) {
        for (const corner of corners) {
          const dist = getManhattanDistance(friend.position, corner);
          if (dist > maxDist) {
            maxDist = dist;
            maxFriend = friend.id;
            maxCorner = `(${corner.x},${corner.y})`;
          }
        }
      }
      return `Initial positions (Max distance: ${maxDist} from ${maxFriend} to ${maxCorner})`;
    }

    if (stepIndex === MOVEMENT_STEPS.length - 1) {
      // Final summary
      return `Summary: The maximum Manhattan distance between any two friends is 8, shown by the green paths from B and C to D`;
    }

    const currentFriends = MOVEMENT_STEPS[stepIndex];
    const destination = currentFriends[0].destination!;

    // Calculate distances from each friend to the destination
    const distancesToDest = currentFriends.map((friend) => ({
      id: friend.id,
      distance: getManhattanDistance(friend.position, destination)
    }));

    // Find max and min distances
    const maxDist = Math.max(...distancesToDest.map((d) => d.distance));
    const minDist = Math.min(...distancesToDest.map((d) => d.distance));
    const maxFriend = distancesToDest.find((d) => d.distance === maxDist)!.id;
    const minFriend = distancesToDest.find((d) => d.distance === minDist)!.id;

    const distances = distancesToDest
      .map((d) => `${d.id}: ${d.distance}`)
      .join(', ');

    return `Moving to (${destination.x},${destination.y}) (${distances}) | Max difference: ${maxDist - minDist} from ${maxFriend} to ${minFriend}`;
  };

  const handleNext = () => {
    if (step < MOVEMENT_STEPS.length - 1) {
      setStep(step + 1);
      setFriends(MOVEMENT_STEPS[step + 1]);
    }
  };

  const handleReset = () => {
    setStep(0);
    setFriends(MOVEMENT_STEPS[0]);
  };

  return (
    <div>
      <CityMap gridSize={6} friends={friends} maxHeight={500} maxWidth={500} />
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button
            onClick={handleNext}
            disabled={step === MOVEMENT_STEPS.length - 1}
          >
            Next Step
          </Button>
          <Button onClick={handleReset} warning>
            Reset
          </Button>
          <span style={{ fontFamily: 'sans-serif' }}>
            Step {step + 1} of {MOVEMENT_STEPS.length}
          </span>
        </div>
        <div style={{ fontFamily: 'sans-serif', fontSize: '16px' }}>
          {getStepDescription(step)}
        </div>
      </div>
    </div>
  );
};

export const ManhattanDistanceBruteForceStory = () => {
  const getManhattanDistance = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    return Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
  };

  const MOVEMENT_STEPS: any = [
    // Initial positions
    FRIENDS,
    // All to A's position
    FRIENDS.map((friend) => ({
      ...friend,
      destination: FRIENDS[0].position
    })),
    // All to B's position
    FRIENDS.map((friend) => ({
      ...friend,
      destination: FRIENDS[1].position
    })),
    // All to C's position
    FRIENDS.map((friend) => ({
      ...friend,
      destination: FRIENDS[2].position
    })),
    // All to D's position
    FRIENDS.map((friend) => ({
      ...friend,
      destination: FRIENDS[3].position
    })),
    // All to E's position
    FRIENDS.map((friend) => ({
      ...friend,
      destination: FRIENDS[4].position
    })),
    // All to F's position
    FRIENDS.map((friend) => ({
      ...friend,
      destination: FRIENDS[5].position
    })),
    // Final summary step - show B->D and C->D paths
    FRIENDS.map((friend) => {
      if (friend.id === 'B') {
        return {
          ...friend,
          destination: FRIENDS[3].position,
          color: '#26deb0'
        }; // Green path from B to D
      }
      if (friend.id === 'C') {
        return {
          ...friend,
          destination: FRIENDS[3].position,
          color: '#26deb0'
        }; // Green path from C to D
      }
      return { ...friend };
    })
  ];

  const [step, setStep] = useState(0);
  const [friends, setFriends] = useState(MOVEMENT_STEPS[0]);

  const getStepDescription = (stepIndex: number) => {
    if (stepIndex === 0) {
      // Calculate max distance in initial positions
      let maxDist = 0;
      let maxPair = '';

      for (let i = 0; i < FRIENDS.length; i++) {
        for (let j = i + 1; j < FRIENDS.length; j++) {
          const dist = getManhattanDistance(
            FRIENDS[i].position,
            FRIENDS[j].position
          );
          if (dist > maxDist) {
            maxDist = dist;
            maxPair = `${FRIENDS[i].id}-${FRIENDS[j].id}`;
          }
        }
      }
      return `Initial positions (Max distance: ${maxDist} between ${maxPair})`;
    }

    if (stepIndex === MOVEMENT_STEPS.length - 1) {
      return `Summary: The maximum Manhattan distance between any two friends is 8, shown by the green paths from B and C to D`;
    }

    const currentFriends = MOVEMENT_STEPS[stepIndex];
    const targetFriend = FRIENDS[stepIndex - 1];

    // Calculate distances to target position
    const distancesToTarget = currentFriends
      .filter((f) => f.id !== targetFriend.id)
      .map((f) => ({
        id: f.id,
        distance: getManhattanDistance(f.position, targetFriend.position)
      }));

    // Find max distance to target
    const maxDist = Math.max(...distancesToTarget.map((d) => d.distance));
    const maxDistFriend = distancesToTarget.find(
      (d) => d.distance === maxDist
    )!;

    const distances = distancesToTarget
      .map((d) => `${d.id}: ${d.distance}`)
      .join(', ');

    return `Moving to ${targetFriend.id}'s position (${distances}) | Max distance: ${maxDist} from ${maxDistFriend.id} to ${targetFriend.id}`;
  };

  const handleNext = () => {
    if (step < MOVEMENT_STEPS.length - 1) {
      setStep(step + 1);
      setFriends(MOVEMENT_STEPS[step + 1]);
    }
  };

  const handleReset = () => {
    setStep(0);
    setFriends(MOVEMENT_STEPS[0]);
  };

  return (
    <div>
      <CityMap gridSize={6} friends={friends} maxHeight={500} maxWidth={500} />
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          flexDirection: 'column'
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button
            onClick={handleNext}
            disabled={step === MOVEMENT_STEPS.length - 1}
          >
            Next Step
          </Button>
          <Button onClick={handleReset} warning>
            Reset
          </Button>
          <span style={{ fontFamily: 'sans-serif' }}>
            Step {step + 1} of {MOVEMENT_STEPS.length}
          </span>
        </div>
        <div style={{ fontFamily: 'sans-serif', fontSize: '16px' }}>
          {getStepDescription(step)}
        </div>
      </div>
    </div>
  );
};
