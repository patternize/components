import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { LinearChart } from './LineChart';

const series = [
  {
    name: 'Revenue',
    color: 'darkorange',
    values: [
      { date: '2010-10-01', value: 10 },
      { date: '2010-11-01', value: 35 },
      { date: '2010-12-01', value: 20 },
      { date: '2011-01-01', value: 45 },
      { date: '2011-02-01', value: 19 }
    ]
  }, {
    name: 'Budget',
    color: 'dodgerblue',
    values: [
      { date: '2010-10-01', value: 30 },
      { date: '2010-11-01', value: 54 },
      { date: '2010-12-01', value: 34 },
      { date: '2011-01-01', value: 92 },
      { date: '2011-02-01', value: 34 }
    ]
  }
];

storiesOf('Lab', module).add('Line', () => (
  <LinearChart series={series} />
));
