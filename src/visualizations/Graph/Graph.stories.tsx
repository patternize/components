import React from 'react';
import { GraphBFS } from './GraphBFS';
import { GraphDFS } from './GraphDFS';
import { GraphDijkstra } from './GraphDijkstra';

export default {
  title: 'Graph'
};

export const GraphDFSStory = () => {
  return <GraphDFS />;
};

export const GraphBFSStory = () => {
  return <GraphBFS />;
};

export const GraphDijkstraStory = () => {
  return <GraphDijkstra />;
};
