import * as React from 'react';

import { Button } from '../../components/Button';
import { Array } from './index';

export default {
  title: 'D3 Modules/Array',
  component: Array
};

export const ArrayStory = () => {
  const [index, setIndex] = React.useState(0);
  const data = [
    [5, 1, 4, 2, 8],
    [1, 5, 4, 2, 8],
    [1, 4, 5, 2, 8],
    [1, 4, 2, 5, 8],
    [1, 2, 4, 5, 8]
  ];
  return (
    <div className="controller">
      <Array data={data[index]} />
      <br />
      <Button onClick={() => setIndex(index - 1)} disabled={index === 0}>
        Previous
      </Button>
      <Button
        onClick={() => setIndex(index + 1)}
        disabled={index === data.length - 1}
      >
        Next
      </Button>
    </div>
  );
};
