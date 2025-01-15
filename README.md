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

