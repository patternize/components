import React from 'react';
import { TreeChart } from './TreeChart';

const tree = {
  name: '🥃',
  children: [
    {
      name: 'Bourbon',
      children: [
        { name: 'Mint', children: [{ name: 'Mint Julep' }] },
        {
          name: 'Vermouth',
          children: [{ name: 'Manhattan' }]
        },
        {
          name: 'Lime',
          children: [
            {
              name: 'Cherry',
              children: [{ name: 'Whiskey Sour' }]
            }
          ]
        },
        {
          name: 'Ice Cube',
          children: [
            {
              name: 'Orange Peel',
              children: [{ name: 'Old Fashioned' }]
            }
          ]
        }
      ]
    },
    {
      name: 'Vodka',
      children: [
        {
          name: 'Tomato',
          children: [{ name: 'Bloody Mary' }]
        },
        {
          name: 'Kahlua',
          children: [
            {
              name: 'Cream',
              children: [{ name: 'White Russian' }]
            }
          ]
        },
        {
          name: 'Cranberry',
          children: [
            {
              name: 'Grapefruit',
              children: [
                { name: 'Sea Breeze' },
                {
                  name: 'Lime',
                  children: [{ name: 'Cosmopolitan' }]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Rum',
      children: [
        {
          name: 'Pineapple',
          children: [
            {
              name: 'Coconut',
              children: [{ name: 'Pina Colada' }]
            }
          ]
        },
        {
          name: 'Lime',
          children: [
            { name: 'Mojito' },
            {
              name: 'Cola',
              children: [{ name: 'Cuba Libre' }]
            }
          ]
        }
      ]
    }
  ]
};

export default {
  title: 'D3 Modules/TreeChart',
  component: TreeChart
};

export const TreeChartStory = () => <TreeChart data={tree} />;
