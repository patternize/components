import { useState } from 'react';
import { Button } from '../../components/Button';
import {
  default as ResponsiveTreeDiagram,
  default as Tree,
  TreeDiagram,
  TreeNode
} from './Tree';
import { applyDiffs } from './utils';

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

export default {
  title: 'Data Structures/Tree'
};

export const TreeStory = () => {
  const [rawTree] = useState(initialRawTree);
  return (
    <TreeDiagram
      inputData={rawTree}
      height={500}
      width={500}
      extraEdges={[{ from: 'D3', to: 'A3' }]}
    />
  );
};

export const TreeResponsiveStory = () => {
  const [rawTree] = useState(initialRawTree);
  return <Tree inputData={rawTree} extraEdges={[{ from: 'D1', to: 'A' }]} />;
};

export const BinaryTreeStory = () => {
  const [binaryTree] = useState<TreeNode>({
    name: '5',
    children: [
      {
        name: '1'
      },
      {
        name: '12',
        children: [
          {
            name: '15'
          },
          {
            name: '16'
          }
        ]
      }
    ]
  });

  return <Tree inputData={binaryTree} maxHeight={250} />;
};

export const BTDFSTraversalStory = () => {
  // Base tree structure for BFS traversal: 1 -> [2,3] -> [4,5,6] -> [8,9]
  const initialRawTree: TreeNode = {
    name: '1',
    visitingCursorColor: '#26deb0',
    children: [
      {
        name: '2',
        children: [
          {
            name: '4',
            children: [{ name: '8' }]
          },
          {
            name: '5',
            children: [{ name: '9' }]
          }
        ]
      },
      {
        name: '3',
        children: [
          {
            name: '6'
          }
        ]
      }
    ]
  };

  // Define changes for each step as diffs from previous state
  const treeSteps = [
    // Step 0: Initial state (rawTree)
    [],
    // Step 1: Visit 1, queue: [2,3]
    [
      { path: ['visited'], value: '#26deb0' },
      { path: ['visitingCursorColor'], value: null, remove: true },
      { path: ['children', 0, 'visitingCursorColor'], value: '#26deb0' },
      { path: ['children', 1, 'visitingCursorColor'], value: '#ff9f1c' }
    ],
    // Step 2: Visit 2, queue: [3,4,5]
    [
      { path: ['children', 0, 'visited'], value: '#26deb0' },
      {
        path: ['children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      { path: ['children', 1, 'visitingCursorColor'], value: '#26deb0' },
      {
        path: ['children', 0, 'children', 0, 'visitingCursorColor'],
        value: '#ff9f1c'
      },
      {
        path: ['children', 0, 'children', 1, 'visitingCursorColor'],
        value: '#6772e5'
      }
    ],
    // Step 3: Visit 3, queue: [4,5,6]
    [
      { path: ['children', 1, 'visited'], value: '#26deb0' },
      {
        path: ['children', 1, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: ['children', 0, 'children', 0, 'visitingCursorColor'],
        value: '#26deb0'
      },
      {
        path: ['children', 1, 'children', 0, 'visitingCursorColor'],
        value: '#ed5565'
      }
    ],
    // Step 4: Visit 4, queue: [5,6,8]
    [
      {
        path: ['children', 0, 'children', 0, 'visited'],
        value: '#26deb0'
      },
      {
        path: ['children', 0, 'children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: ['children', 0, 'children', 1, 'visitingCursorColor'],
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
        value: '#ff9f1c'
      }
    ],
    // Step 5: Visit 5, queue: [6,8,9]
    [
      {
        path: ['children', 0, 'children', 1, 'visited'],
        value: '#26deb0'
      },
      {
        path: ['children', 0, 'children', 1, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      {
        path: ['children', 1, 'children', 0, 'visitingCursorColor'],
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
        value: '#6772e5'
      }
    ],
    // Step 6: Visit 6, queue: [8,9]
    [
      {
        path: ['children', 1, 'children', 0, 'visited'],
        value: '#26deb0'
      },
      {
        path: ['children', 1, 'children', 0, 'visitingCursorColor'],
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
    // Step 7: Visit 8, queue: [9]
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
    // Step 8: Visit 9, queue: []
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

  // Define the queue for each step
  const queueStates = [
    ['1'],
    ['2', '3'],
    ['3', '4', '5'],
    ['4', '5', '6'],
    ['5', '6', '8'],
    ['6', '8', '9'],
    ['8', '9'],
    ['9'],
    ['Queue empty - BFS Complete!']
  ];

  return (
    <div>
      <ResponsiveTreeDiagram inputData={currentTree} height={300} width={500} />
      <br />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button onClick={handleClick} disabled={step === treeSteps.length - 1}>
          Next Step
        </Button>
        <Button onClick={resetTree} warning>
          Reset Tree
        </Button>
        <span style={{ fontFamily: 'sans-serif' }}>
          Queue: {queueStates[step].join(', ')}
        </span>
      </div>
    </div>
  );
};

export const BTBFSTraversalStory = () => {
  // Base tree structure for DFS traversal: 1 -> 2 -> 4 -> 8 -> 4 -> 2 -> 5 -> 9 -> 5 -> 2 -> 1 -> 3 -> 6
  const initialRawTree: TreeNode = {
    name: '1',
    visitingCursorColor: '#26deb0',
    children: [
      {
        name: '2',
        children: [
          {
            name: '4',
            children: [{ name: '8' }]
          },
          {
            name: '5',
            children: [{ name: '9' }]
          }
        ]
      },
      {
        name: '3',
        children: [
          {
            name: '6'
          }
        ]
      }
    ]
  };

  // Define changes for each step as diffs from previous state
  const treeSteps = [
    // Step 0: Initial state (rawTree)
    [],
    // Step 1: 1 visited, 2 visiting
    [
      { path: ['visited'], value: '#26deb0' },
      { path: ['visitingCursorColor'], value: null, remove: true },
      { path: ['children', 0, 'visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 2: 2 visited, 4 visiting
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
    // Step 3: 4 visited, 8 visiting
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
    // Step 4: 8 visited, back to 4 visiting
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
    // Step 5: Back to 2 visiting
    [
      {
        path: ['children', 0, 'children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      { path: ['children', 0, 'visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 6: 5 visiting
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
    // Step 7: 5 visited, 9 visiting
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
    // Step 8: 9 visited, back to 5 visiting
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
    // Step 9: Back to 2 visiting
    [
      {
        path: ['children', 0, 'children', 1, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      { path: ['children', 0, 'visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 10: Back to 1 visiting
    [
      {
        path: ['children', 0, 'visitingCursorColor'],
        value: null,
        remove: true
      },
      { path: ['visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 11: 3 visiting
    [
      { path: ['visitingCursorColor'], value: null, remove: true },
      { path: ['children', 1, 'visitingCursorColor'], value: '#26deb0' }
    ],
    // Step 12: 3 visited, 6 visiting
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
    // Step 13: Final state - 6 visited
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
    ['1'],
    ['1', '2'],
    ['1', '2', '4'],
    ['1', '2', '4', '8'],
    ['1', '2', '4'],
    ['1', '2'],
    ['1', '2', '5'],
    ['1', '2', '5', '9'],
    ['1', '2', '5'],
    ['1', '2'],
    ['1'],
    ['1', '3'],
    ['1', '3', '6'],
    ['1', '3']
  ];

  return (
    <div>
      <ResponsiveTreeDiagram inputData={currentTree} height={300} width={500} />
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
