import { Meta, Story } from '@storybook/react';
import React from 'react';
import { SlideShow, SlideShowProps } from './SlideShow';

export default {
  title: 'Example/SlideShow',
  component: SlideShow,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta;

const images = [
  'https://patternize.github.io/img/pattern.svg',
  'https://patternize.github.io/img/association.svg',
  'https://patternize.github.io/img/brain.svg'
];

const Template: Story<SlideShowProps> = (args) => <SlideShow {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  images,
  maxWidth: '1000px'
};
