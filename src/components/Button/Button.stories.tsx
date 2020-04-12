import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from './index';
import { withInfo } from '@storybook/addon-info';

const stories = storiesOf('React Components', module);

stories.addDecorator(withInfo);
stories.addParameters({ info: { inline: true } });

stories.add('Button', () => {
  return (
    <div className={'controller'}>
      <br />
      <Button>Dark</Button>
      <Button>Light</Button>
    </div>
  );
});
