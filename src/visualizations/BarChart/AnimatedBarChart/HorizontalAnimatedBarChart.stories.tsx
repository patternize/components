import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { HorizontalAnimatedBarChart } from './HorizontalAnimatedBarChart';
import { Button } from 'components/Button';

storiesOf('D3 Modules', module).add('AnimatedStackBarChart', () =>
  React.createElement(() => {
    const data = [
      [5, 1, 4, 2, 8],
      [1, 5, 4, 2, 8],
      [1, 4, 5, 2, 8],
      [1, 4, 2, 5, 8],
      [1, 2, 4, 5, 8],
    ];
    const barchartDatapoints = data.map((d) => {
      return d.map((val, idx) => {
        return { value: val, index: idx, color: 'grey' };
      });
    });

    const [datapoints, setDatapoints] = React.useState(() => {
        return barchartDatapoints[0];
    });

    const [ index, setIndex ] = React.useState(0);

    const changeIdx = (idx) => {
      let newDatapoints = barchartDatapoints[idx];
      let currentDatapoints = [...datapoints];
      for (let i in currentDatapoints) {
        if (
          newDatapoints[i].value !== currentDatapoints[i].value ||
          newDatapoints[i].index !== currentDatapoints[i].index
        ) {
            currentDatapoints[i] = newDatapoints[i];
            currentDatapoints[i].color = 'green'
        } else {
            currentDatapoints[i].color = 'grey'
        }
      }
      setIndex(idx);
      setDatapoints(currentDatapoints);
    };

    return (
      <div className={'controller'}>
        <HorizontalAnimatedBarChart data={datapoints} />
        <br />
        <Button onClick={() => changeIdx(index - 1)} disabled={index == 0}>
          Previous
        </Button>
        <Button
          onClick={() => changeIdx(index + 1)}
          disabled={index == data.length - 1}
        >
          Next
        </Button>
      </div>
    );
  })
);
