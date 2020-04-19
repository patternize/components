import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { VerticalBarChart } from './VerticalBarChart';
import { HorizontalBarChart } from './HorizontalBarChart';
import { Button } from 'components/Button';

storiesOf('D3 Modules', module).add('VerticalBarChart', () =>
  React.createElement(() => {
    const [data, setData] = React.useState([25, 30, 45, 60, 10, 65, 75]);

    return (
      <div className={'controller'}>
        <VerticalBarChart data={data} />
        <Button onClick={() => setData(data.map(value => value + 5))}>
          Update data
        </Button>
        <Button onClick={() => setData(data.filter(value => value < 35))}>
          Filter data
        </Button>
        <Button
          onClick={() => setData([...data, Math.round(Math.random() * 100)])}
        >
          Add data
        </Button>
      </div>
    );
  })
);

storiesOf('D3 Modules', module).add('HorizontalBarChart', () =>
  React.createElement(() => {
    const [data, setData] = React.useState([25, 30, 45, 60, 10, 65, 75]);

    return (
      <div className={'controller'}>
        <HorizontalBarChart data={data} />
        <Button onClick={() => setData(data.map(value => value + 5))}>
          Update data
        </Button>
        <Button onClick={() => setData(data.filter(value => value < 35))}>
          Filter data
        </Button>
        <Button
          onClick={() => setData([...data, Math.round(Math.random() * 100)])}
        >
          Add data
        </Button>
      </div>
    );
  })
);
