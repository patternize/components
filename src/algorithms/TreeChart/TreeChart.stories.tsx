import React from 'react';
import { Button } from '../../components/Button';
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

export const BackgroundTreeChartStory = () => {
  const [showMyBackground, setShowMyBackground] = React.useState(false);

  const tree = {
    name: '📝 Application',
    children: [
      {
        name: '✅ Most Important',
        children: [
          {
            name: '📄 SOP (Statement of Purpose)'
          }
        ]
      },
      {
        name: '📌 Highly Important',
        children: [{ name: '📨 LORs (3 Letters of Recommendation)' }]
      },
      {
        name: '⚙ Important',
        children: [
          {
            name: '🎓 Undergraduate',
            children: [
              { name: '🏛️ School Reputation' },
              { name: '📊 Undergrad GPA' },
              { name: '📚 Major & Coursework' }
            ]
          },
          {
            name: '💼 Experience',
            children: [
              { name: '👔 Professional' },
              { name: '🌱 Personal Projects' }
            ]
          }
        ]
      },
      {
        name: '📉 Less Important',
        children: [{ name: '📝 TOEFL/GRE' }]
      }
    ]
  };

  const myBackgroundTree = {
    name: 'My Background',
    children: [
      {
        name: '📄 SOP'
      },
      {
        name: '📨 LORs',
        children: [
          { name: 'Professor from Columbia University' },
          { name: 'Professor from McGill University' },
          { name: 'Top Management from Meta/Google tier company' },
          { name: 'CEO of my current company' }
        ]
      },
      {
        name: '🎓 Undergraduate',
        children: [
          { name: '🏛️ McGill University, Canada' },
          { name: '📊 GPA: Average ~3.5/4.0' },
          { name: '📚 Computer Science' }
        ]
      },
      {
        name: '💼 Experience',
        children: [
          {
            name: '👔 Professional',
            children: [
              { name: 'Tableau Software' },
              { name: 'Airbnb' },
              { name: 'Presence' }
            ]
          },
          {
            name: '🌱 Personal Projects',
            children: [{ name: 'Patternize.io ~500 ⭐️ on github' }]
          }
        ]
      },
      {
        name: '📝 TOEFL/GRE',
        children: [{ name: 'GRE: 337/400' }]
      }
    ]
  };

  return (
    <div>
      <TreeChart data={showMyBackground ? myBackgroundTree : tree} />
      <Button onClick={() => setShowMyBackground(!showMyBackground)}>
        {showMyBackground
          ? 'Show Application Components'
          : 'Show My Background'}
      </Button>
    </div>
  );
};
