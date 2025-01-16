import { Meta, Story } from '@storybook/react';
import React from 'react';

import { Button, ButtonProps } from './index';

export default {
  title: 'Basics/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'Button'
};
