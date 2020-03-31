import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { Circle } from './Circle';

storiesOf('Lab', module).add('Circle', () => (
  <Circle data={[10, 30, 50, 60, 100]} />
));
