import * as React from 'react';
import { Button } from '../../components/Button';
import { Array } from '../Array';
import { VerticalBarChart } from '../BarChart';

interface ColorRange {
  start: number;
  end: number;
  color: string;
}

export const Sorting = ({
  data,
  steps,
  colorRanges
}: {
  data: number[][];
  steps: string[];
  colorRanges?: ColorRange[][]; // Array of color ranges for each step
}) => {
  const [index, setIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  const currentColors = colorRanges?.[index] || [];

  return (
    <div
      className={`sorting-container ${isLoading ? 'loading' : ''}`}
      style={{ paddingTop: '20px' }}
    >
      <Array data={data[index]} colorRanges={currentColors} />
      <VerticalBarChart data={data[index]} colorRanges={currentColors} />
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
