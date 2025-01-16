import React from 'react';
import { SlideShow } from './SlideShow';

export default {
  title: 'Basics/SlideShow'
};

export const SlideShowStory = () => (
  <SlideShow
    images={[
      'https://patternize.github.io/img/pattern.svg',
      'https://patternize.github.io/img/association.svg',
      'https://patternize.github.io/img/brain.svg'
    ]}
    maxWidth="1000px"
    maxHeight="500px"
  />
);
