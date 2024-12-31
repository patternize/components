import React from 'react';
import { ConcurrentTraversal } from './ConcurrentTraversal';
import { DFSTraversal } from './DFSTraversal';
import ReactFiber from './index';
import { MorrisTraversal } from './MorrisTraversal';
export default {
  title: 'React Fiber'
};

export const ReactFiberStory = () => <ReactFiber />;

export const MorrisTraversalStoryStory = () => <MorrisTraversal />;

export const DFSTraversalStoryStory = () => <DFSTraversal />;

export const ConcurrentTraversalStoryStory = () => <ConcurrentTraversal />;
