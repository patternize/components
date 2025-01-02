import { useState } from 'react';
import Button from '../../components/Button';
import ResponsiveGraphDiagram, { GraphNode } from './Graph';

const initialNodes: GraphNode[] = [
  { id: 'A', visitingCursorColor: '#26deb0', x: 100, y: 100 },
  { id: 'B', x: 200, y: 100 },
  { id: 'C', x: 100, y: 200 },
  { id: 'D', x: 200, y: 200 },
  { id: 'E', x: 300, y: 150 },
  { id: 'F', x: 300, y: 250 },
  { id: 'G', visited: '#ff0000', x: 400, y: 200 }
];

const edges = [
  { source: 'A', target: 'B', weight: 4 },
  { source: 'A', target: 'C', weight: 2 },
  { source: 'B', target: 'D', weight: 3 },
  { source: 'C', target: 'D', weight: 1 },
  { source: 'D', target: 'E', weight: 5 },
  { source: 'D', target: 'F', weight: 2 },
  { source: 'E', target: 'G', weight: 2 },
  { source: 'F', target: 'G', weight: 3 }
];

// Dijkstra steps: A -> C -> D -> F -> G
const dijkstraSteps = [
  // Initial state - A is visiting
  [
    { id: 'A', visitingCursorColor: '#26deb0' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' },
    { id: 'E' },
    { id: 'F' },
    { id: 'G', visited: '#ff0000' }
  ],
  // A visited, checking C
  [
    { id: 'A', visited: '#26deb0' },
    { id: 'B' },
    { id: 'C', visitingCursorColor: '#26deb0' },
    { id: 'D' },
    { id: 'E' },
    { id: 'F' },
    { id: 'G', visited: '#ff0000' }
  ],
  // C visited (shortest path = 2), checking D
  [
    { id: 'A', visited: '#26deb0' },
    { id: 'B' },
    { id: 'C', visited: '#26deb0' },
    { id: 'D', visitingCursorColor: '#26deb0' },
    { id: 'E' },
    { id: 'F' },
    { id: 'G', visited: '#ff0000' }
  ],
  // D visited (shortest path = 3), checking F
  [
    { id: 'A', visited: '#26deb0' },
    { id: 'B' },
    { id: 'C', visited: '#26deb0' },
    { id: 'D', visited: '#26deb0' },
    { id: 'E' },
    { id: 'F', visitingCursorColor: '#26deb0' },
    { id: 'G', visited: '#ff0000' }
  ],
  // F visited (shortest path = 5), checking G
  [
    { id: 'A', visited: '#26deb0' },
    { id: 'B' },
    { id: 'C', visited: '#26deb0' },
    { id: 'D', visited: '#26deb0' },
    { id: 'E' },
    { id: 'F', visited: '#26deb0' },
    { id: 'G', visited: '#ff0000', visitingCursorColor: '#26deb0' }
  ],
  // G visited (shortest path = 8)
  [
    { id: 'A', visited: '#26deb0' },
    { id: 'B' },
    { id: 'C', visited: '#26deb0' },
    { id: 'D', visited: '#26deb0' },
    { id: 'E' },
    { id: 'F', visited: '#26deb0' },
    { id: 'G', visited: '#ff0000' }
  ]
];

export const GraphDijkstra = () => {
  const [step, setStep] = useState(0);
  const [nodes, setNodes] = useState(
    initialNodes.map((node, i) => ({
      ...node,
      ...dijkstraSteps[0][i]
    }))
  );

  const handleNext = () => {
    if (step < dijkstraSteps.length - 1) {
      setStep(step + 1);
      setNodes((prevNodes) => {
        return prevNodes.map((node, i) => ({
          ...initialNodes[i],
          visited: dijkstraSteps[step + 1][i].visited,
          visitingCursorColor: dijkstraSteps[step + 1][i].visitingCursorColor
        }));
      });
    }
  };

  const handleReset = () => {
    setStep(0);
    setNodes(
      initialNodes.map((node, i) => ({
        ...node,
        ...dijkstraSteps[0][i]
      }))
    );
  };

  const distanceStates = [
    ['A(0)'],
    ['A(0), C(2)'],
    ['A(0), C(2), D(3)'],
    ['A(0), C(2), D(3), F(5)'],
    ['A(0), C(2), D(3), F(5), G(8)'],
    ['Shortest path to G: A->C->D->F->G (cost: 8)']
  ];

  return (
    <div>
      <ResponsiveGraphDiagram
        nodes={nodes}
        edges={edges}
        width={500}
        height={400}
      />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <Button
          onClick={handleNext}
          disabled={step === dijkstraSteps.length - 1}
        >
          Next Step
        </Button>
        <Button onClick={handleReset} warning>
          Reset
        </Button>
        <span style={{ fontFamily: 'sans-serif' }}>
          Distances: {distanceStates[step]}
        </span>
      </div>
    </div>
  );
};
