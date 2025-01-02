import { useState } from 'react';
import Button from '../../components/Button';
import { CityMap } from './2DMap';

export default {
  title: '2D Map'
};

const FRIENDS = [
  { id: 'A', color: '#26deb0', position: { x: 0, y: 0 } },
  { id: 'B', color: '#ff9f1c', position: { x: 3, y: 0 } },
  { id: 'C', color: '#6772e5', position: { x: 0, y: 3 } },
  { id: 'D', color: '#ed5565', position: { x: 3, y: 3 } }
];

export const StaticMapStory = () => <CityMap gridSize={4} friends={FRIENDS} />;

const MOVEMENT_STEPS = [
  // Initial positions
  FRIENDS,
  // Step 1: Each friend moves one step inward
  [
    { ...FRIENDS[0], position: { x: 1, y: 1 } },
    { ...FRIENDS[1], position: { x: 2, y: 1 } },
    { ...FRIENDS[2], position: { x: 1, y: 2 } },
    { ...FRIENDS[3], position: { x: 2, y: 2 } }
  ],
  // Step 2: Friends A and B meet, C and D meet
  [
    { ...FRIENDS[0], position: { x: 2, y: 1 } },
    { ...FRIENDS[1], position: { x: 2, y: 1 } },
    { ...FRIENDS[2], position: { x: 1, y: 2 } },
    { ...FRIENDS[3], position: { x: 1, y: 2 } }
  ],
  // Step 3: All friends meet in the center
  [
    { ...FRIENDS[0], position: { x: 1, y: 1 } },
    { ...FRIENDS[1], position: { x: 1, y: 1 } },
    { ...FRIENDS[2], position: { x: 1, y: 1 } },
    { ...FRIENDS[3], position: { x: 1, y: 1 } }
  ]
];

export const AnimatedMapStory = () => {
  const [step, setStep] = useState(0);
  const [friends, setFriends] = useState(MOVEMENT_STEPS[0]);

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
      <CityMap gridSize={4} friends={friends} />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
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
    </div>
  );
};
