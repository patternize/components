import React from 'react';
import Tree, { TreeDiagram } from './Tree';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const rawTree: TreeNode = {
  name: 'Root',
  children: [
    {
      name: 'A',
      children: [
        { name: 'A1' },
        { name: 'A2' },
        { name: 'A3' },
        {
          name: 'C',
          children: [
            { name: 'C1' },
            {
              name: 'D',
              children: [{ name: 'D1' }, { name: 'D2' }, { name: 'D3' }]
            }
          ]
        }
      ]
    },
    { name: 'Z' },
    {
      name: 'B',
      children: [{ name: 'B1' }, { name: 'B2' }, { name: 'B3' }]
    }
  ]
};

export default {
  title: 'D3 Modules'
};

export const TreeStory = () => (
  <TreeDiagram inputData={rawTree} height={500} width={500} />
);

export const TreeResponsiveStory = () => <Tree inputData={rawTree} />;
