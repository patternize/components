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

const tree2 = {
  name: '👨🏻‍💻',
  children: [
    {
      name: 'Work',
      children: [
        {
          name: 'Tableau Software 📈'
        },
        { name: 'Salesforce ☁️' },
        { name: 'Airbnb 🏡' },
        { name: 'Presence 🎮' }
      ]
    },
    {
      name: 'Tech Stack',
      children: [
        {
          name: 'Client',
          children: [{ name: 'iOS' }, { name: 'Unity' }, { name: 'React' }]
        },
        {
          name: 'Backend',
          children: [
            { name: 'Java' },
            { name: 'Docker' },
            { name: 'Kafka' },
            { name: 'Kubernetes' }
          ]
        }
      ]
    },
    {
      name: 'Product',
      children: [{ name: 'Growth' }, { name: 'AI-Native' }]
    },
    {
      name: 'Hobby',
      children: [
        {
          name: 'Workout',
          children: [
            { name: 'Soccer ⚽️' },
            { name: 'Running 🏃🏻‍♀️' },
            { name: 'Gym 😅' }
          ]
        },
        {
          name: 'Music',
          children: [
            { name: 'Guitar 🎸' },
            { name: 'Piano 🎹' },
            { name: 'Music Tech 🎧' }
          ]
        }
      ]
    }
  ]
};

export default {
  title: 'Algorithms/Backtracking',
  component: TreeChart
};

export const TreeChartStory = () => <TreeChart data={tree2} />;
