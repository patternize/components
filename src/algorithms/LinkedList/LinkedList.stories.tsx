import { useState } from 'react';
import Button from '../../components/Button';
import ResponsiveLinkedList, { LinkedListNode, green } from './LinkedList';

// Helper function to create nodes (without positions)
const createNode = (
  id: string,
  value: string,
  nextNode?: string,
  options: Partial<LinkedListNode> = {}
): LinkedListNode => ({
  id,
  value,
  nextNode,
  ...options
});

export const LLInsertOperation = () => {
  const [step, setStep] = useState(0);

  const insertSteps = [
    // Initial state: A -> B -> C
    [
      createNode('node-0', 'A', 'node-1'),
      createNode('node-1', 'B', 'node-2'),
      createNode('node-2', 'C')
    ],

    // Highlight B (insertion point)
    [
      createNode('node-0', 'A', 'node-1'),
      createNode('node-1', 'B', 'node-2', { highlight: green }),
      createNode('node-2', 'C')
    ],

    // Show new node X above C, with arrow pointing to C
    [
      createNode('node-0', 'A', 'node-1'),
      createNode('node-1', 'B', 'node-2', { highlight: green }),
      createNode('node-2', 'C'),
      createNode('new', 'X', 'node-2', { visiting: true, floating: true })
    ],

    // Move X down, still pointing to C, B still points to C
    [
      createNode('node-0', 'A', 'node-1'),
      createNode('node-1', 'B', 'node-2', { highlight: green }),
      createNode('node-2', 'C'),
      createNode('new', 'X', 'node-2', { visiting: true })
    ],

    // Final state: Update B to point to X
    [
      createNode('node-0', 'A', 'node-1'),
      createNode('node-1', 'B', 'new'),
      createNode('node-2', 'C'),
      createNode('new', 'X', 'node-2')
    ]
  ];

  const stepExplanations = [
    'Initial linked list: A -> B -> C',
    'Highlight node B where we want to insert X',
    'Create new node X and make it point to C',
    'Move X into position while maintaining pointers',
    'Update B to point to X, completing the insertion'
  ];

  return (
    <div>
      <ResponsiveLinkedList nodes={insertSteps[step]} height={150} />
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        <Button
          onClick={() =>
            setStep((s) => Math.min(s + 1, insertSteps.length - 1))
          }
          disabled={step === insertSteps.length - 1}
        >
          Next Step
        </Button>
        <Button onClick={() => setStep(0)} warning>
          Reset
        </Button>
        <span style={{ fontFamily: 'sans-serif', color: '#374469' }}>
          {stepExplanations[step]}
        </span>
      </div>
    </div>
  );
};

// Remove operation story
export const LLRemoveOperation = () => {
  const [step, setStep] = useState(0);

  const removeSteps = [
    // Initial state: A -> B -> C -> D
    [
      createNode('node-0', 'A', 'node-1'),
      createNode('node-1', 'B', 'node-2'),
      createNode('node-2', 'C', 'node-3'),
      createNode('node-3', 'D')
    ],

    // Highlight B (node to remove)
    [
      createNode('node-0', 'A', 'node-1'),
      createNode('node-1', 'B', 'node-2', { highlight: '#ff6b6b' }),
      createNode('node-2', 'C', 'node-3'),
      createNode('node-3', 'D')
    ],

    // Move B up, A now points to C
    [
      createNode('node-0', 'A', 'node-2'),
      createNode('node-1', 'B', 'node-2', {
        highlight: '#ff6b6b',
        floating: true
      }),
      createNode('node-2', 'C', 'node-3'),
      createNode('node-3', 'D')
    ],

    // Final state: A -> C -> D
    [
      createNode('node-0', 'A', 'node-2'),
      createNode('node-2', 'C', 'node-3'),
      createNode('node-3', 'D')
    ]
  ];

  const stepExplanations = [
    'Initial linked list: A -> B -> C -> D',
    'Highlight node B to be removed',
    'Update A to point to C, B will be removed',
    'Node B is removed, list is now: A -> C -> D'
  ];

  return (
    <div>
      <ResponsiveLinkedList nodes={removeSteps[step]} height={150} />
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        <Button
          onClick={() =>
            setStep((s) => Math.min(s + 1, removeSteps.length - 1))
          }
          disabled={step === removeSteps.length - 1}
        >
          Next Step
        </Button>
        <Button onClick={() => setStep(0)} warning>
          Reset
        </Button>
        <span style={{ fontFamily: 'sans-serif', color: '#374469' }}>
          {stepExplanations[step]}
        </span>
      </div>
    </div>
  );
};

export default {
  title: 'LinkedList'
};
