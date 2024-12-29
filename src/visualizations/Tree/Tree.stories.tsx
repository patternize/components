import React from 'react';
import Tree, { TreeDiagram } from './Tree';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const rawTree: TreeNode = {
  name: 'App',
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
  <Tree inputData={{
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
  }} maxHeight={250}/>
);

