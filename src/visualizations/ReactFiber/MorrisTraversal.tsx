import { useState } from 'react';
import { Button } from '../../components/Button';
import { TreeDiagram, TreeNode } from '../Tree/Tree';
import { applyDiffs } from './utils';

export const MorrisTraversal = () => {
  // Base tree structure for DFS traversal: App -> A -> C1 -> D1 -> C2 -> D2 -> B -> C1
  const initialRawTree: TreeNode = {
    name: 'App',
    visitingCursorColor: '#26deb0',
    children: [
      {
        name: 'A',
        children: [
          {
            name: 'C1',
            children: [{ name: 'D1' }]
          },
          {
            name: 'C2',
            children: [{ name: 'D2' }]
          }
        ]
      },
      {
        name: 'B',
        children: [
          {
            name: 'C1'
          }
        ]
      }
    ]
  };

  // Define changes for each step as diffs from previous state
  const treeSteps = [
    // Step 0: Initial state (rawTree)
    [],
    // Step 1: App visited, A visiting
    [
      { path: ['visited'], value: '#26deb0' },
      { path: ['visitingCursorColor'], value: null, remove: true },
      { path: ['children', 0, 'visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 2: A visited, C1 visiting
    [
      { path: ['children', 0, 'visited'], value: '#26deb0' },
      {
        path: ['children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: ['children', 0, 'children', 0, 'visitingCursorColor'],
        value: '#26deb0'
      }
    ],
    // Step 3: C1 visited, D1 visiting
    [
      { path: ['children', 0, 'children', 0, 'visited'], value: '#26deb0' },
      {
        path: ['children', 0, 'children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: [
          'children',
          0,
          'children',
          0,
          'children',
          0,
          'visitingCursorColor'
        ],
        value: '#26deb0'
      }
    ],
    // Step 4: D1 visited, back to A visiting
    [
      {
        path: ['children', 0, 'children', 0, 'children', 0, 'visited'],
        value: '#26deb0'
      },
      {
        path: [
          'children',
          0,
          'children',
          0,
          'children',
          0,
          'visitingCursorColor'
        ],
        value: null,
        remove: true
      },
      { path: ['children', 0, 'visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 5: C2 visiting
    [
      {
        path: ['children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: ['children', 0, 'children', 1, 'visitingCursorColor'],
        value: '#26deb0'
      }
    ],
    // Step 6: C2 visited, D2 visiting
    [
      { path: ['children', 0, 'children', 1, 'visited'], value: '#26deb0' },
      {
        path: ['children', 0, 'children', 1, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: [
          'children',
          0,
          'children',
          1,
          'children',
          0,
          'visitingCursorColor'
        ],
        value: '#26deb0'
      }
    ],
    // Step 7: D2 visited, back to App visiting
    [
      {
        path: ['children', 0, 'children', 1, 'children', 0, 'visited'],
        value: '#26deb0'
      },
      {
        path: [
          'children',
          0,
          'children',
          1,
          'children',
          0,
          'visitingCursorColor'
        ],
        value: null,
        remove: true
      },
      { path: ['visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 8: B visiting
    [
      { path: ['visitingCursorColor'], value: null, remove: true },
      { path: ['children', 1, 'visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 9: B visited, C1 visiting
    [
      { path: ['children', 1, 'visited'], value: '#26deb0' },
      {
        path: ['children', 1, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: ['children', 1, 'children', 0, 'visitingCursorColor'],
        value: '#26deb0'
      }
    ],
    // Step 10: Final state - C1 visited
    [
      { path: ['children', 1, 'children', 0, 'visited'], value: '#26deb0' },
      {
        path: ['children', 1, 'children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      }
    ]
  ];

  const [step, setStep] = useState(0);
  const [currentTree, setCurrentTree] = useState(initialRawTree);

  const handleClick = () => {
    if (step < treeSteps.length - 1) {
      const nextStep = step + 1;
      const newTree = applyDiffs(currentTree, treeSteps[nextStep] as any);
      setCurrentTree(newTree);
      setStep(nextStep);
    } else {
      setStep(0);
      setCurrentTree(initialRawTree);
    }
  };

  const resetTree = () => {
    setStep(0);
    setCurrentTree(initialRawTree);
  };

  const stackStates = [
    ['App'],
    ['A'],
    ['C1'],
    ['D1'],
    ['A'],
    ['C2'],
    ['D2'],
    ['App'],
    ['B'],
    ['C1'],
    ['App', 'O(1) Space always!']
  ];

  return (
    <div>
      <TreeDiagram
        inputData={currentTree}
        height={400}
        width={500}
        extraEdges={[
          { from: 'D1', to: 'A' },
          { from: 'D2', to: 'App' }
        ]}
      />
      <br />
      <Button onClick={handleClick} disabled={step === treeSteps.length - 1}>
        Next Step
      </Button>
      <Button onClick={resetTree} warning>
        Reset Tree
      </Button>
      <span style={{ fontFamily: 'sans-serif' }}>
        Stack: {stackStates[step].join(', ')}
      </span>
    </div>
  );
};
