import * as React from 'react';
import { Button } from '../../components/Button';
import { Array } from '../Array';
import { VerticalBarChart } from '../BarChart';

export const Sorting = ({
  data,
  steps
}: {
  data: number[][];
  steps: string[];
}) => {
  const [index, setIndex] = React.useState(0);

  return (
    <div className={'controller'}>
      <Array data={data[index]} />
      <VerticalBarChart data={data[index]} />
      <br />
      <Button onClick={() => setIndex(index - 1)} disabled={index == 0}>
        Previous
      </Button>
      <Button
        onClick={() => setIndex(index + 1)}
        disabled={index == data.length - 1}
      >
        Next
      </Button>
      <span style={{ marginLeft: '10px' }}>{steps[index]}</span>
    </div>
  );
};
