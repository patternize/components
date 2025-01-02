import { useState } from 'react';
import { Button } from '../../components/Button';
import ResponsiveTreeDiagram, { TreeNode } from '../Tree/Tree';
import { applyDiffs } from '../Tree/utils';

export const ConcurrentTraversal = () => {
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
            name: 'E1',
            children: [{ name: 'F1' }]
          },
          {
            name: 'E2',
            children: [{ name: 'F2' }]
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
      { path: ['visitingCursorColor'], value: '#ff9f1c' },
      { path: ['children', 0, 'visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 2: A visited, C1 visiting + concurrent B visiting with orange cursor
    [
      { path: ['visitingCursorColor'], value: null, remove: true },
      { path: ['children', 0, 'visited'], value: '#26deb0' },
      {
        path: ['children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: ['children', 0, 'children', 0, 'visitingCursorColor'],
        value: '#26deb0'
      },
      { path: ['children', 1, 'visitingCursorColor'], value: '#ff9f1c' }
    ],
    // Step 3: C1 visited, D1 visiting + B visited, E1 visiting
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
      },
      { path: ['children', 1, 'visited'], value: '#ff9f1c' },
      {
        path: ['children', 1, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: ['children', 1, 'children', 0, 'visitingCursorColor'],
        value: '#ff9f1c'
      }
    ],
    // Step 4: D1 visited, C2 visiting + E1 visited, F1 visiting
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
      {
        path: ['children', 0, 'children', 1, 'visitingCursorColor'],
        value: '#26deb0'
      },
      { path: ['children', 1, 'children', 0, 'visited'], value: '#ff9f1c' },
      {
        path: ['children', 1, 'children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: [
          'children',
          1,
          'children',
          0,
          'children',
          0,
          'visitingCursorColor'
        ],
        value: '#ff9f1c'
      }
    ],
    // Step 5: C2 visited, D2 visiting + F1 visited, E2 visiting
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
      },
      {
        path: ['children', 1, 'children', 0, 'children', 0, 'visited'],
        value: '#ff9f1c'
      },
      {
        path: [
          'children',
          1,
          'children',
          0,
          'children',
          0,
          'visitingCursorColor'
        ],
        value: null,
        remove: true
      },
      {
        path: ['children', 1, 'children', 1, 'visitingCursorColor'],
        value: '#ff9f1c'
      }
    ],
    // Step 6: D2 visited + E2 visited, F2 visiting
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
      { path: ['children', 1, 'children', 1, 'visited'], value: '#ff9f1c' },
      {
        path: ['children', 1, 'children', 1, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: [
          'children',
          1,
          'children',
          1,
          'children',
          0,
          'visitingCursorColor'
        ],
        value: '#ff9f1c'
      }
    ],
    // Step 7: Final state - F2 visited
    [
      {
        path: ['children', 1, 'children', 1, 'children', 0, 'visited'],
        value: '#ff9f1c'
      },
      {
        path: [
          'children',
          1,
          'children',
          1,
          'children',
          0,
          'visitingCursorColor'
        ],
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
    ['Green Pointer at App'],
    ['Green Pointer at A', 'Orange Pointer at App'],
    ['Green Pointer at C1', 'Orange Pointer at B'],
    ['Green Pointer at D1', 'Orange Pointer at E1'],
    ['Green Pointer at C2', 'Orange Pointer at F1'],
    ['Green Pointer at D2', 'Orange Pointer at E2'],
    ['Green Pointer done!', 'Orange Pointer at F2'],
    ['Green Pointer done!', 'Orange Pointer done!']
  ];

  return (
    <div>
      <ResponsiveTreeDiagram
        inputData={currentTree}
        height={400}
        width={500}
        extraEdges={[
          { from: 'A', to: 'B' },
          { from: 'D1', to: 'A' },
          { from: 'D2', to: 'App' },
          { from: 'C1', to: 'C2' },
          { from: 'D1', to: 'C2' },
          { from: 'E1', to: 'E2' },
          { from: 'F1', to: 'E2' }
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
        Pointers: {stackStates[step].join(', ')}
      </span>
    </div>
  );
};
