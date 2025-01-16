import React from 'react';
import { Button } from '../../components/Button';
import { HorizontalBarChart } from './HorizontalBarChart';
import { VerticalBarChart } from './VerticalBarChart';

export default {
  title: 'Visualizations/Barchart'
};

export const VerticalBarChartStory = () => {
  const [data, setData] = React.useState([25, 30, 45, 60, 10, 65, 75]);

  return (
    <div className="controller">
      <VerticalBarChart data={data} />
      <Button onClick={() => setData(data.map((value) => value + 5))}>
        Update data
      </Button>
      <Button onClick={() => setData(data.filter((value) => value < 35))}>
        Filter data
      </Button>
      <Button
        onClick={() => setData([...data, Math.round(Math.random() * 100)])}
      >
        Add data
      </Button>
    </div>
  );
};

export const HorizontalBarChartStory = () => {
  const [data, setData] = React.useState([25, 30, 45, 60, 10, 65, 75]);

  return (
    <div className="controller">
      <HorizontalBarChart data={data} />
      <Button onClick={() => setData(data.map((value) => value + 5))}>
        Update data
      </Button>
      <Button onClick={() => setData(data.filter((value) => value < 35))}>
        Filter data
      </Button>
      <Button
        onClick={() => setData([...data, Math.round(Math.random() * 100)])}
      >
        Add data
      </Button>
    </div>
  );
};
