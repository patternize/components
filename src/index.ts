// ─────────────────────────────────────────────────────────────────────────
// @patternize/components — public API
//
// Exports are grouped by domain. The library is intentionally composed of
// small, atomic, data-driven components: feed them data + theme, get a
// visualization. Interactive demos live in the /workbench, not here.
// ─────────────────────────────────────────────────────────────────────────

// Theme ─────────────────────────────────────────────────────────────────────
export * from './theme';

// Machine learning / tensors ────────────────────────────────────────────────
// (3D tensors live in the optional '@patternize/components/three' entry.)
export * from './ml';

// Data structures & algorithms ──────────────────────────────────────────────
export { Array } from './algorithms/Array/Array';
export type { ArrayProps } from './algorithms/Array/Array';
export { PriorityQueue } from './algorithms/PriorityQueue/PriorityQueue';
export type { PriorityQueueProps } from './algorithms/PriorityQueue/PriorityQueue';
export { VerticalBarChart } from './algorithms/BarChart';
export { default as Graph } from './algorithms/Graph/Graph';
export { default as LinkedList } from './algorithms/LinkedList/LinkedList';
export { default as ReactFiber } from './algorithms/ReactFiber';
export { Sorting } from './algorithms/Sorting/Sorting';
export { default as Tree } from './algorithms/Tree/Tree';
export { TreeChart } from './algorithms/TreeChart/TreeChart';
export {
  AnimatedCityMap,
  CityMap
} from './algorithms/ManhattanDistance/ManhattanDistance';

// General components ─────────────────────────────────────────────────────────
export { Button } from './components/Button';
export { SlideShow } from './components/SlideShow/SlideShow';
export { CycleFlow } from './components/CycleFlow/CycleFlow';

// Visualizations ─────────────────────────────────────────────────────────────
export { default as WorldMap } from './visualizations/Map/WorldMap';
export { default as Timeline } from './visualizations/Timeline/Timeline';

// Hooks ──────────────────────────────────────────────────────────────────────
export { usePrevious, useResizeObserver } from './hooks';
