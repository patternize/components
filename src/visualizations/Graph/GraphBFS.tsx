import { useState } from 'react';
import Button from '../../components/Button';
import { GraphDiagram, GraphNode } from './Graph';

const initialNodes: GraphNode[] = [
  { id: 'A', visitingCursorColor: '#26deb0', x: 100, y: 100 },
  { id: 'B', x: 200, y: 100 },
  { id: 'C', x: 100, y: 200 },
  { id: 'D', x: 200, y: 200 },
  { id: 'E', x: 300, y: 150 },
  { id: 'F', x: 300, y: 250 },
  { id: 'G', x: 400, y: 200 }
];

const edges = [
  { source: 'A', target: 'B' },
  { source: 'A', target: 'C' },
  { source: 'B', target: 'D' },
  { source: 'C', target: 'D' },
  { source: 'D', target: 'E' },
  { source: 'D', target: 'F' },
  { source: 'E', target: 'G' },
  { source: 'F', target: 'G' }
];

// BFS steps: A -> [B,C] -> [D] -> [E,F] -> [G]
const bfsSteps = [
  // Initial state - A is visiting
  [
    { id: 'A', visitingCursorColor: '#26deb0' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' },
    { id: 'E' },
    { id: 'F' },
    { id: 'G' }
  ],
  // A visited, B and C are visiting
  [
    { id: 'A', visited: '#26deb0' },
    { id: 'B', visitingCursorColor: '#26deb0' },
    { id: 'C', visitingCursorColor: '#26deb0' },
    { id: 'D' },
    { id: 'E' },
    { id: 'F' },
    { id: 'G' }
  ],
  // B and C visited, D is visiting
  [
    { id: 'A', visited: '#26deb0' },
    { id: 'B', visited: '#26deb0' },
    { id: 'C', visited: '#26deb0' },
    { id: 'D', visitingCursorColor: '#26deb0' },
    { id: 'E' },
    { id: 'F' },
    { id: 'G' }
  ],
  // D visited, E and F are visiting
  [
    { id: 'A', visited: '#26deb0' },
    { id: 'B', visited: '#26deb0' },
    { id: 'C', visited: '#26deb0' },
    { id: 'D', visited: '#26deb0' },
    { id: 'E', visitingCursorColor: '#26deb0' },
    { id: 'F', visitingCursorColor: '#26deb0' },
    { id: 'G' }
  ],
  // E and F visited, G is visiting
  [
    { id: 'A', visited: '#26deb0' },
    { id: 'B', visited: '#26deb0' },
    { id: 'C', visited: '#26deb0' },
    { id: 'D', visited: '#26deb0' },
    { id: 'E', visited: '#26deb0' },
    { id: 'F', visited: '#26deb0' },
    { id: 'G', visitingCursorColor: '#26deb0' }
  ],
  // All visited
  [
    { id: 'A', visited: '#26deb0' },
    { id: 'B', visited: '#26deb0' },
    { id: 'C', visited: '#26deb0' },
    { id: 'D', visited: '#26deb0' },
    { id: 'E', visited: '#26deb0' },
    { id: 'F', visited: '#26deb0' },
    { id: 'G', visited: '#26deb0' }
  ]
];

export const GraphBFS = () => {
  const [step, setStep] = useState(0);
  const [nodes, setNodes] = useState(
    initialNodes.map((node, i) => ({
      ...node,
      ...bfsSteps[0][i]
    }))
  );

  const handleNext = () => {
    if (step < bfsSteps.length - 1) {
      setStep(step + 1);
      setNodes((prevNodes) => {
        return prevNodes.map((node, i) => ({
          ...initialNodes[i],
          visited: bfsSteps[step + 1][i].visited,
          visitingCursorColor: bfsSteps[step + 1][i].visitingCursorColor
        }));
      });
    }
  };

  const handleReset = () => {
    setStep(0);
    setNodes(
      initialNodes.map((node, i) => ({
        ...node,
        ...bfsSteps[0][i]
      }))
    );
  };

  const queueStates = [
    ['A'],
    ['B', 'C'],
    ['D'],
    ['E', 'F'],
    ['G'],
    ['BFS Complete!']
  ];

  return (
    <div>
      <GraphDiagram nodes={nodes} edges={edges} width={500} height={400} />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <Button onClick={handleNext} disabled={step === bfsSteps.length - 1}>
          Next Step
        </Button>
        <Button onClick={handleReset} warning>
          Reset
        </Button>
        <span style={{ fontFamily: 'sans-serif' }}>
          Queue: {queueStates[step].join(', ')}
        </span>
      </div>
    </div>
  );
};
