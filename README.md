# Patternize Components

React components for algorithm visualization and interactive learning.

## Installation

```bash
npm install @patternize/components
# or
yarn add @patternize/components
```

## Features

### Algorithm Visualizations
- **Sorting Algorithms**
  - Merge Sort
  - Bubble Sort
  - Selection Sort
- **Tree Operations**
  - DFS/BFS Traversals
  - B-Tree Operations
  - Trie Operations
- **Graph Algorithms**
  - Depth-First Search
  - Breadth-First Search
  - Dijkstra's Algorithm
- **Data Structures**
  - Linked List Operations
  - Binary Tree Operations
  - React Fiber Visualization

### Interactive Components
- Array Visualization
- Tree Charts
- Timeline
- World Map
- Cycle Flow

### Animated Charts (Airbnb-inspired design language)
Props-driven, responsive, and animated with react-spring — built to be dropped
straight into markdown/MDX pages. Styled per `DESIGN.md`, with a
colorblind-validated categorical palette (see `src/theme/palette.ts`).

- **LineChart / AreaChart** — staggered draw-in, crosshair + tooltip, direct end labels
- **BarChart** — bars grow from the baseline, rounded data-ends, hover tooltip
- **DonutChart** — segments sweep in, animated center total, hover lift
- **ScatterPlot** — points pop in, nearest-point tooltip (up to 4 series)
- **Heatmap** — sequential teal/rausch ramps, cells reveal in reading order
- **StatTile / StatRow** — counting KPI numbers with delta chips
- **ProgressRing** — animated arc with counting percentage

```jsx
import { LineChart, StatRow, StatTile } from '@patternize/components';

<StatRow>
  <StatTile label="Revenue" value={48200} prefix="$" delta={8.3} />
  <StatTile label="Occupancy" value={87.4} decimals={1} suffix="%" delta={2.1} />
</StatRow>

<LineChart
  title="Nights booked"
  series={[
    { name: 'Tokyo', data: [{ x: 'Jan', y: 42 }, { x: 'Feb', y: 48 }] },
    { name: 'Lisbon', data: [{ x: 'Jan', y: 30 }, { x: 'Feb', y: 35 }] }
  ]}
/>
```

## Usage Examples

```jsx
import { 
  Sorting, 
  Graph, 
  Tree, 
  LinkedList 
} from '@patternize/components';

// Merge Sort Example
export const SortingExample = () => {
  return <MergeSortStory />;
};

// Graph Traversal Example
export const GraphExample = () => {
  return <GraphDFSStory />;
};
```

## Development

This project uses Node.js v16.10.0 for development.

### Available Scripts
- `yarn start` - Runs Storybook for development
- `yarn build` - Builds the package
- `yarn test` - Runs tests
- `yarn lint` - Runs linter

### Publishing
1. Bump version:
```bash
npm version patch
```

2. Push changes with tags:
```bash
git push --follow-tags
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

