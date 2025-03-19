import { useState } from 'react';
import ResponsiveTreeDiagram, { TreeNode } from '../../algorithms/Tree/Tree';
import { applyDiffs } from '../../algorithms/Tree/utils';
import { Button } from '../../components/Button';
import ReactFiber from './index';

export default {
  title: 'Case Studies/React Fiber'
};

export const ReactFiberStory = () => <ReactFiber />;

export const MorrisTraversalStory = () => {
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
      <ResponsiveTreeDiagram
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

export const DFSTraversalStory = () => {
  // Base tree structure for DFS traversal: App -> A -> C1 -> D1 -> C1 -> A -> C2 -> D2 -> C2 -> A -> App -> B -> C1
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
    // Step 4: D1 visited, back to C1 visiting
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
        path: ['children', 0, 'children', 0, 'visitingCursorColor'],
        value: '#26deb0'
      }
    ],
    // Step 5: Back to A visiting
    [
      {
        path: ['children', 0, 'children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      { path: ['children', 0, 'visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 6: C2 visiting
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
    // Step 7: C2 visited, D2 visiting
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
    // Step 8: D2 visited, back to C2 visiting
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
      {
        path: ['children', 0, 'children', 1, 'visitingCursorColor'],
        value: '#26deb0'
      }
    ],
    // Step 9: Back to A visiting
    [
      {
        path: ['children', 0, 'children', 1, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      { path: ['children', 0, 'visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 10: Back to App visiting
    [
      {
        path: ['children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      { path: ['visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 11: B visiting
    [
      { path: ['visitingCursorColor'], value: null, remove: true },
      { path: ['children', 1, 'visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 12: B visited, C1 visiting
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
    // Step 13: Final state - C1 visited
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

  // Define the stack for each step
  const stackStates = [
    ['App'],
    ['App', 'A'],
    ['App', 'A', 'C1'],
    ['App', 'A', 'C1', 'D1'],
    ['App', 'A', 'C1'],
    ['App', 'A'],
    ['App', 'A', 'C2'],
    ['App', 'A', 'C2', 'D2'],
    ['App', 'A', 'C2'],
    ['App', 'A'],
    ['App'],
    ['App', 'B'],
    ['App', 'B', 'C1'],
    ['App', 'B']
  ];

  return (
    <div>
      <ResponsiveTreeDiagram inputData={currentTree} height={400} width={500} />
      <br />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
    </div>
  );
};

export const ConcurrentTraversalStory = () => {
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
