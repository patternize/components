import * as React from 'react';

import { storiesOf } from '@storybook/react';
import Tree from './Tree';

interface TreeNode {
  name: string;
  children?: this[];
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
            {
              name: 'C1'
            },
            {
              name: 'D',
              children: [
                {
                  name: 'D1'
                },
                {
                  name: 'D2'
                },
                {
                  name: 'D3'
                }
              ]
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

storiesOf('D3 Modules', module).add('Tree', () => (
  <Tree inputData={rawTree} height={800} width={500} />
));
