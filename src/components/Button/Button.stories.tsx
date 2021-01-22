import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react';

import { Button, ButtonProps } from './index';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  children: 'button'
};
