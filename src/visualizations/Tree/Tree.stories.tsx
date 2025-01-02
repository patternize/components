import React, { useState } from 'react';
import { BTBFSTraversal } from './BinaryTree/BTBFSTraversal';
import { BTDFSTraversal } from './BinaryTree/BTDFSTraversal';
import Tree, { TreeDiagram, TreeNode } from './Tree';

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
  title: 'Tree'
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
  return <BTDFSTraversal />;
};

export const BTBFSTraversalStory = () => {
  return <BTBFSTraversal />;
};
