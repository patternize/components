import type { Meta } from '@storybook/react';
import { useState } from 'react';
import Button from '../../components/Button';
import { BTree } from './BTree';

const meta = {
  title: 'BTree',
  component: BTree
} satisfies Meta<typeof BTree>;

export default meta;

const insertionSteps = [
  // Step 1: Single node with [1]
  {
    keys: [1],
    isLeaf: true
  },
  // Step 2: Add 2 to node [1,2]
  {
    keys: [1, 2],
    isLeaf: true,
    highlight: '2'
  },
  // Step 3: Split on insert 3
  {
    keys: [2],
    isLeaf: false,
    children: [
      {
        keys: [1],
        isLeaf: true
      },
      {
        keys: [3],
        isLeaf: true,
        highlight: '3'
      }
    ]
  },
  // Step 4: Add 4
  {
    keys: [2],
    isLeaf: false,
    children: [
      {
        keys: [1],
        isLeaf: true
      },
      {
        keys: [3, 4],
        isLeaf: true,
        highlight: '4'
      }
    ]
  },
  // Step 5: Split on insert 5
  {
    keys: [2, 4],
    isLeaf: false,
    children: [
      {
        keys: [1],
        isLeaf: true
      },
      {
        keys: [3],
        isLeaf: true
      },
      {
        keys: [5],
        isLeaf: true,
        highlight: '5'
      }
    ]
  },
  // Step 6: Add 6
  {
    keys: [2, 4],
    isLeaf: false,
    children: [
      {
        keys: [1],
        isLeaf: true
      },
      {
        keys: [3],
        isLeaf: true
      },
      {
        keys: [5, 6],
        isLeaf: true,
        highlight: '6'
      }
    ]
  },
  // Step 7: Split and restructure for 7
  {
    keys: [4],
    isLeaf: false,
    children: [
      {
        keys: [2],
        isLeaf: false,
        children: [
          {
            keys: [1],
            isLeaf: true
          },
          {
            keys: [3],
            isLeaf: true
          }
        ]
      },
      {
        keys: [6],
        isLeaf: false,
        children: [
          {
            keys: [5],
            isLeaf: true
          },
          {
            keys: [7],
            isLeaf: true,
            highlight: '7'
          }
        ]
      }
    ]
  },
  // Step 8: Add 8
  {
    keys: [4],
    isLeaf: false,
    children: [
      {
        keys: [2],
        isLeaf: false,
        children: [
          {
            keys: [1],
            isLeaf: true
          },
          {
            keys: [3],
            isLeaf: true
          }
        ]
      },
      {
        keys: [6, 8],
        isLeaf: false,
        children: [
          {
            keys: [5],
            isLeaf: true
          },
          {
            keys: [7],
            isLeaf: true
          },
          {
            keys: [9],
            isLeaf: true,
            highlight: '8'
          }
        ]
      }
    ]
  },
  // Step 9: Add 9
  {
    keys: [4],
    isLeaf: false,
    children: [
      {
        keys: [2],
        isLeaf: false,
        children: [
          {
            keys: [1],
            isLeaf: true
          },
          {
            keys: [3],
            isLeaf: true
          }
        ]
      },
      {
        keys: [6, 8],
        isLeaf: false,
        children: [
          {
            keys: [5],
            isLeaf: true
          },
          {
            keys: [7],
            isLeaf: true
          },
          {
            keys: [9],
            isLeaf: true,
            highlight: '9'
          }
        ]
      }
    ]
  }
];

const insertionDescriptions = [
  'Initial tree with single node [1]',
  'Add 2: Insert into leaf node [1,2]',
  'Add 3: Split node and create new root [2]',
  'Add 4: Insert into right leaf node [3,4]',
  'Add 5: Split right node, root becomes [2,4]',
  'Add 6: Insert into rightmost leaf node [5,6]',
  'Add 7: Split and restructure tree with root [4]',
  'Add 8: Insert into right subtree',
  'Add 9: Insert into rightmost leaf node'
];

const deletionSteps = [
  // Initial tree with all values
  {
    keys: [4],
    isLeaf: false,
    children: [
      {
        keys: [2],
        isLeaf: false,
        children: [
          {
            keys: [1],
            isLeaf: true
          },
          {
            keys: [3],
            isLeaf: true
          }
        ]
      },
      {
        keys: [6, 8],
        isLeaf: false,
        children: [
          {
            keys: [5],
            isLeaf: true
          },
          {
            keys: [7],
            isLeaf: true
          },
          {
            keys: [9],
            isLeaf: true
          }
        ]
      }
    ]
  },
  // Delete 1: Remove and rebalance
  {
    keys: [4],
    isLeaf: false,
    children: [
      {
        keys: [2, 3],
        isLeaf: true,
        highlight: 'rebalanced'
      },
      {
        keys: [6, 8],
        isLeaf: false,
        children: [
          {
            keys: [5],
            isLeaf: true
          },
          {
            keys: [7],
            isLeaf: true
          },
          {
            keys: [9],
            isLeaf: true
          }
        ]
      }
    ]
  },
  // Delete 3: Remove and rebalance
  {
    keys: [4],
    isLeaf: false,
    children: [
      {
        keys: [2],
        isLeaf: true,
        highlight: 'rebalanced'
      },
      {
        keys: [6, 8],
        isLeaf: false,
        children: [
          {
            keys: [5],
            isLeaf: true
          },
          {
            keys: [7],
            isLeaf: true
          },
          {
            keys: [9],
            isLeaf: true
          }
        ]
      }
    ]
  },
  // Delete 5: Remove and rebalance
  {
    keys: [4, 8],
    isLeaf: false,
    children: [
      {
        keys: [2],
        isLeaf: true
      },
      {
        keys: [6, 7],
        isLeaf: true,
        highlight: 'rebalanced'
      },
      {
        keys: [9],
        isLeaf: true
      }
    ]
  }
];

const deletionDescriptions = [
  'Initial tree with values [1-9]',
  'Delete 1: Merge with sibling node [2,3]',
  'Delete 3: Rebalance remaining nodes',
  'Delete 5: Remove and rebalance remaining nodes'
];

export const BTreeInsertion = () => {
  const [step, setStep] = useState(0);

  return (
    <div>
      <BTree data={insertionSteps[step]} maxHeight={400} />
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        <Button
          onClick={() => setStep((s) => Math.min(s + 1, insertionSteps.length - 1))}
          disabled={step === insertionSteps.length - 1}
        >
          Next Step
        </Button>
        <Button onClick={() => setStep(0)} warning>
          Reset
        </Button>
        <span style={{ fontFamily: 'sans-serif', color: '#374469' }}>
          {insertionDescriptions[step]}
        </span>
      </div>
    </div>
  );
};

export const BTreeDeletion = () => {
  const [step, setStep] = useState(0);

  return (
    <div>
      <BTree data={deletionSteps[step]} maxHeight={400} />
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        <Button
          onClick={() => setStep((s) => Math.min(s + 1, deletionSteps.length - 1))}
          disabled={step === deletionSteps.length - 1}
        >
          Next Step
        </Button>
        <Button onClick={() => setStep(0)} warning>
          Reset
        </Button>
        <span style={{ fontFamily: 'sans-serif', color: '#374469' }}>
          {deletionDescriptions[step]}
        </span>
      </div>
    </div>
  );
};