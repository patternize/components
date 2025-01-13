import { useState } from 'react';
export default {
  title: 'Graph'
};
import Button from '../../components/Button';
import ResponsiveGraphDiagram from './Graph';
import { GraphNode } from './Graph';

export const GraphDFSStory = () => {
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
      <ResponsiveGraphDiagram
        nodes={nodes}
        edges={edges}
        width={500}
        height={400}
      />
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

export const GraphBFSStory = () => {
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

  // DFS steps: A -> B -> D -> E -> G -> F
  const dfsSteps = [
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
    // A visited, B is visiting
    [
      { id: 'A', visited: '#26deb0' },
      { id: 'B', visitingCursorColor: '#26deb0' },
      { id: 'C' },
      { id: 'D' },
      { id: 'E' },
      { id: 'F' },
      { id: 'G' }
    ],
    // B visited, D is visiting
    [
      { id: 'A', visited: '#26deb0' },
      { id: 'B', visited: '#26deb0' },
      { id: 'C' },
      { id: 'D', visitingCursorColor: '#26deb0' },
      { id: 'E' },
      { id: 'F' },
      { id: 'G' }
    ],
    // D visited, E is visiting
    [
      { id: 'A', visited: '#26deb0' },
      { id: 'B', visited: '#26deb0' },
      { id: 'C' },
      { id: 'D', visited: '#26deb0' },
      { id: 'E', visitingCursorColor: '#26deb0' },
      { id: 'F' },
      { id: 'G' }
    ],
    // E visited, G is visiting
    [
      { id: 'A', visited: '#26deb0' },
      { id: 'B', visited: '#26deb0' },
      { id: 'C' },
      { id: 'D', visited: '#26deb0' },
      { id: 'E', visited: '#26deb0' },
      { id: 'F' },
      { id: 'G', visitingCursorColor: '#26deb0' }
    ],
    // G visited, backtrack to D, F is visiting
    [
      { id: 'A', visited: '#26deb0' },
      { id: 'B', visited: '#26deb0' },
      { id: 'C' },
      { id: 'D', visited: '#26deb0' },
      { id: 'E', visited: '#26deb0' },
      { id: 'F', visitingCursorColor: '#26deb0' },
      { id: 'G', visited: '#26deb0' }
    ],
    // F visited, backtrack to D, C is visiting
    [
      { id: 'A', visited: '#26deb0' },
      { id: 'B', visited: '#26deb0' },
      { id: 'C', visitingCursorColor: '#26deb0' },
      { id: 'D', visited: '#26deb0' },
      { id: 'E', visited: '#26deb0' },
      { id: 'F', visited: '#26deb0' },
      { id: 'G', visited: '#26deb0' }
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

  const [step, setStep] = useState(0);
  const [nodes, setNodes] = useState(
    initialNodes.map((node, i) => ({
      ...node,
      ...dfsSteps[0][i]
    }))
  );

  const handleNext = () => {
    if (step < dfsSteps.length - 1) {
      setStep(step + 1);
      setNodes((prevNodes) => {
        return prevNodes.map((node, i) => ({
          ...node,
          visited: dfsSteps[step + 1][i].visited,
          visitingCursorColor: dfsSteps[step + 1][i].visitingCursorColor
        }));
      });
    }
  };

  const handleReset = () => {
    setStep(0);
    setNodes(
      initialNodes.map((node, i) => ({
        ...node,
        ...dfsSteps[0][i]
      }))
    );
  };

  const stackStates = [
    ['A'],
    ['A', 'B'],
    ['A', 'B', 'D'],
    ['A', 'B', 'D', 'E'],
    ['A', 'B', 'D', 'E', 'G'],
    ['A', 'B', 'D', 'F'],
    ['A', 'B', 'D', 'C'],
    ['DFS Complete!']
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
        <Button onClick={handleNext} disabled={step === dfsSteps.length - 1}>
          Next Step
        </Button>
        <Button onClick={handleReset} warning>
          Reset
        </Button>
        <span style={{ fontFamily: 'sans-serif' }}>
          Stack: {stackStates[step].join(', ')}
        </span>
      </div>
    </div>
  );
};

export const GraphDijkstraStory = () => {
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
