import React, { useState } from 'react';
import { Button } from '../../components/Button';
import Tree, { TreeDiagram, TreeNode } from './Tree';

// DFS traversal order: App -> A -> C1 -> D1 -> C2 -> D2 -> B -> C1
const rawTree: TreeNode = {
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

const rawTree2: TreeNode = {
  name: 'App',
  visited: '#26deb0',
  children: [
    {
      name: 'A',
      visitingCursorColor: '#26deb0',
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

const rawTree3: TreeNode = {
  name: 'App',
  visited: '#26deb0',
  children: [
    {
      name: 'A',
      visited: '#26deb0',
      children: [
        {
          name: 'C1',
          visitingCursorColor: '#26deb0',
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

const rawTree4: TreeNode = {
  name: 'App',
  visited: '#26deb0',
  children: [
    {
      name: 'A',
      visited: '#26deb0',
      children: [
        {
          name: 'C1',
          visited: '#26deb0',
          children: [{ name: 'D1', visitingCursorColor: '#26deb0' }]
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

const rawTree5: TreeNode = {
  name: 'App',
  visited: '#26deb0',
  children: [
    {
      name: 'A',
      visitingCursorColor: '#26deb0',
      visited: '#26deb0',
      children: [
        {
          name: 'C1',
          visited: '#26deb0',
          children: [{ name: 'D1', visited: '#26deb0' }]
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

const rawTree6: TreeNode = {
  name: 'App',
  visited: '#26deb0',
  children: [
    {
      name: 'A',
      visited: '#26deb0',
      children: [
        {
          name: 'C1',
          visited: '#26deb0',
          children: [{ name: 'D1', visited: '#26deb0' }]
        },
        {
          name: 'C2',
          visitingCursorColor: '#26deb0',
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

const rawTree7: TreeNode = {
  name: 'App',
  visited: '#26deb0',
  children: [
    {
      name: 'A',
      visited: '#26deb0',
      children: [
        {
          name: 'C1',
          visited: '#26deb0',
          children: [{ name: 'D1', visited: '#26deb0' }]
        },
        {
          name: 'C2',
          visited: '#26deb0',
          children: [{ name: 'D2', visitingCursorColor: '#26deb0' }]
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

const rawTree8: TreeNode = {
  name: 'App',
  visited: '#26deb0',
  visitingCursorColor: '#26deb0',
  children: [
    {
      name: 'A',
      visited: '#26deb0',
      children: [
        {
          name: 'C1',
          visited: '#26deb0',
          children: [{ name: 'D1', visited: '#26deb0' }]
        },
        {
          name: 'C2',
          visited: '#26deb0',
          children: [{ name: 'D2', visited: '#26deb0' }]
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
const rawTree9: TreeNode = {
  name: 'App',
  visited: '#26deb0',
  children: [
    {
      name: 'A',
      visited: '#26deb0',
      children: [
        {
          name: 'C1',
          visited: '#26deb0',
          children: [{ name: 'D1', visited: '#26deb0' }]
        },
        {
          name: 'C2',
          visited: '#26deb0',
          children: [{ name: 'D2', visited: '#26deb0' }]
        }
      ]
    },
    {
      name: 'B',
      visitingCursorColor: '#26deb0',
      children: [
        {
          name: 'C1'
        }
      ]
    }
  ]
};

const rawTree10: TreeNode = {
  name: 'App',
  visited: '#26deb0',
  children: [
    {
      name: 'A',
      visited: '#26deb0',
      children: [
        {
          name: 'C1',
          visited: '#26deb0',
          children: [{ name: 'D1', visited: '#26deb0' }]
        },
        {
          name: 'C2',
          visited: '#26deb0',
          children: [{ name: 'D2', visited: '#26deb0' }]
        }
      ]
    },
    {
      name: 'B',
      visited: '#26deb0',
      children: [
        {
          name: 'C1',
          visitingCursorColor: '#26deb0'
        }
      ]
    }
  ]
};

const rawTree11: TreeNode = {
  name: 'App',
  visited: '#26deb0',
  children: [
    {
      name: 'A',
      visited: '#26deb0',
      children: [
        {
          name: 'C1',
          visited: '#26deb0',
          children: [{ name: 'D1', visited: '#26deb0' }]
        },
        {
          name: 'C2',
          visited: '#26deb0',
          children: [{ name: 'D2', visited: '#26deb0' }]
        }
      ]
    },
    {
      name: 'B',
      visited: '#26deb0',
      children: [
        {
          name: 'C1',
          visited: '#26deb0'
        }
      ]
    }
  ]
};

export default {
  title: 'D3 Modules'
};

export const TreeStory = () => (
  <TreeDiagram
    inputData={rawTree}
    height={500}
    width={500}
    extraEdges={[{ from: 'D3', to: 'A3' }]}
  />
);

export const TreeResponsiveStory = () => (
  <Tree inputData={rawTree} extraEdges={[{ from: 'D1', to: 'A' }]} />
);

export const BinaryTreeStory = () => (
  <Tree
    inputData={{
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
    }}
    maxHeight={250}
  />
);

export const TreeAnimatedStory = () => {
  const [currentTree, setCurrentTree] = useState(rawTree);
  const [step, setStep] = useState(0);

  const handleClick = () => {
    if (step === 0) {
      setCurrentTree(rawTree2);
      setStep(1);
    } else if (step === 1) {
      setCurrentTree(rawTree3);
      setStep(2);
    } else if (step === 2) {
      setCurrentTree(rawTree4);
      setStep(3);
    } else if (step === 3) {
      setCurrentTree(rawTree5);
      setStep(4);
    } else if (step === 4) {
      setCurrentTree(rawTree6);
      setStep(5);
    } else if (step === 5) {
      setCurrentTree(rawTree7);
      setStep(6);
    } else if (step === 6) {
      setCurrentTree(rawTree8);
      setStep(7);
    } else if (step === 7) {
      setCurrentTree(rawTree9);
      setStep(8);
    } else if (step === 8) {
      setCurrentTree(rawTree10);
      setStep(9);
    } else if (step === 9) {
      setCurrentTree(rawTree11);
      setStep(10);
    } else {
      setCurrentTree(rawTree);
      setStep(0);
    }
  };

  const resetTree = () => {
    setCurrentTree(rawTree);
    setStep(0);
  };

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
      <Button onClick={handleClick} disabled={step === 10}>
        Next Step
      </Button>
      <Button onClick={resetTree} warning>
        Reset Tree
      </Button>
    </div>
  );
};
