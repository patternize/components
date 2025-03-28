import React from 'react';
import { Viewpager } from './Viewpager';

export default {
  title: 'Basics/Viewpager'
};

export const ViewpagerStory = () => (
  // <div style={{ height: '400px', width: '100%' }}>
  <Viewpager
    images={[
      'https://picsum.photos/id/1018/600/600', // Mountain landscape
      'https://picsum.photos/id/1015/600/600', // River and forest
      'https://picsum.photos/id/1019/600/600', // Nature landscape
      'https://picsum.photos/id/1016/600/600', // Mountain and lake
      'https://picsum.photos/id/1025/600/600' // Birds on a branch
    ]}
  />
  // </div>
);
