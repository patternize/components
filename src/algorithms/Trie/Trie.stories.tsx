import type { Meta } from '@storybook/react';
import { useState } from 'react';
import Button from '../../components/Button';
import ResponsiveTreeDiagram from '../Tree/Tree';

const meta = {
  title: 'Data Structures/Trie',
  component: ResponsiveTreeDiagram
} satisfies Meta<typeof ResponsiveTreeDiagram>;

export default meta;

const insertionSteps = [
  // Initial empty trie with just root
  {
    name: 'root',
    children: []
  },
  // Insert "cat"
  {
    name: 'root',
    children: [
      {
        name: 'c',
        children: [
          {
            name: 'a',
            children: [
              {
                name: 't',
                children: [
                  {
                    name: '*', // end marker
                    highlight: 'inserted-cat'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  // Insert "car"
  {
    name: 'root',
    children: [
      {
        name: 'c',
        children: [
          {
            name: 'a',
            children: [
              {
                name: 't',
                children: [
                  {
                    name: '*'
                  }
                ]
              },
              {
                name: 'r',
                children: [
                  {
                    name: '*',
                    highlight: 'inserted-car'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  // Insert "dog"
  {
    name: 'root',
    children: [
      {
        name: 'c',
        children: [
          {
            name: 'a',
            children: [
              {
                name: 't',
                children: [
                  {
                    name: '*'
                  }
                ]
              },
              {
                name: 'r',
                children: [
                  {
                    name: '*'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'd',
        children: [
          {
            name: 'o',
            children: [
              {
                name: 'g',
                children: [
                  {
                    name: '*',
                    highlight: 'inserted-dog'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const stepDescriptions = [
  'Initial empty trie',
  'Insert "cat": Create path c->a->t->*',
  'Insert "car": Reuse "ca" prefix, add "r->*"',
  'Insert "dog": Create new path d->o->g->*'
];

export const TrieInsertion = () => {
  const [step, setStep] = useState(0);

  return (
    <div>
      <ResponsiveTreeDiagram inputData={insertionSteps[step]} maxHeight={400} />
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        <Button
          onClick={() =>
            setStep((s) => Math.min(s + 1, insertionSteps.length - 1))
          }
          disabled={step === insertionSteps.length - 1}
        >
          Next Step
        </Button>
        <Button onClick={() => setStep(0)} warning>
          Reset
        </Button>
        <span style={{ fontFamily: 'sans-serif', color: '#374469' }}>
          {stepDescriptions[step]}
        </span>
      </div>
    </div>
  );
};

const searchSteps = [
  // Initial trie with "cat", "car", "dog" loaded
  {
    name: 'root',
    visitingCursorColor: '#26deb0',
    children: [
      {
        name: 'c',
        children: [
          {
            name: 'a',
            children: [
              {
                name: 't',
                children: [
                  {
                    name: '*'
                  }
                ]
              },
              {
                name: 'r',
                children: [
                  {
                    name: '*'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'd',
        children: [
          {
            name: 'o',
            children: [
              {
                name: 'g',
                children: [
                  {
                    name: '*'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  // Searching "ca": Step 1 - visit 'c'
  {
    name: 'root',
    children: [
      {
        name: 'c',
        visitingCursorColor: '#26deb0',
        children: [
          {
            name: 'a',
            children: [
              {
                name: 't',
                children: [
                  {
                    name: '*'
                  }
                ]
              },
              {
                name: 'r',
                children: [
                  {
                    name: '*'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'd',
        children: [
          {
            name: 'o',
            children: [
              {
                name: 'g',
                children: [
                  {
                    name: '*'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  // Searching "ca": Step 2 - visit 'a', found prefix match
  {
    name: 'root',
    children: [
      {
        name: 'c',
        visited: '#26deb0',
        children: [
          {
            name: 'a',
            visitingCursorColor: '#26deb0',
            children: [
              {
                name: 't',
                children: [
                  {
                    name: '*'
                  }
                ]
              },
              {
                name: 'r',
                children: [
                  {
                    name: '*'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'd',
        children: [
          {
            name: 'o',
            children: [
              {
                name: 'g',
                children: [
                  {
                    name: '*'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  // Searching "ca": Step 3 - highlight all matches
  {
    name: 'root',
    children: [
      {
        name: 'c',
        visited: '#26deb0',
        children: [
          {
            name: 'a',
            visited: '#26deb0',
            children: [
              {
                name: 't',
                visited: '#ff9900',
                children: [
                  {
                    name: '*',
                    visited: '#ff9900'
                  }
                ]
              },
              {
                name: 'r',
                visited: '#ff9900',
                children: [
                  {
                    name: '*',
                    visited: '#ff9900'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'd',
        children: [
          {
            name: 'o',
            children: [
              {
                name: 'g',
                children: [
                  {
                    name: '*'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

const searchDescriptions = [
  'Initial trie containing "cat", "car", "dog"',
  'Search "ca": Visit node "c"',
  'Search "ca": Visit node "a", found prefix match',
  'Search "ca": Found words "cat" and "car" with prefix "ca"'
];

export const TrieSearch = () => {
  const [step, setStep] = useState(0);

  return (
    <div>
      <ResponsiveTreeDiagram inputData={searchSteps[step]} maxHeight={400} />
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}
      >
        <Button
          onClick={() =>
            setStep((s) => Math.min(s + 1, searchSteps.length - 1))
          }
          disabled={step === searchSteps.length - 1}
        >
          Next Step
        </Button>
        <Button onClick={() => setStep(0)} warning>
          Reset
        </Button>
        <span style={{ fontFamily: 'sans-serif', color: '#374469' }}>
          {searchDescriptions[step]}
        </span>
      </div>
    </div>
  );
};

export const Insertion = () => <TrieInsertion />;
export const Search = () => <TrieSearch />;
