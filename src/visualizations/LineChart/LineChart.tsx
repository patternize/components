import * as React from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from 'hooks';

const { useRef, useEffect } = React;

type TimeSeriesDataPoints = {
  date: Date | string; // in format of utc or user defined format that is convertible with parseDate function
  value: number;
};
type TimeSeries = {
  name: string;
  color: string;
  values: TimeSeriesDataPoints[];
};

interface ILineChartProps {
  series: TimeSeries[];
  parseDate?: (string) => Date;
}

const _parseDate = (string) => d3.utcParse('%Y-%m-%d')(string);
const _mergeDates = (series: TimeSeries[]): Date[] => {
  let dates = [];
  series.map((timeSeries) => {
    dates = [...timeSeries.values.map((e) => _parseDate(e.date)), ...dates];
  });

  return dates;
};
const _mergeValues = (series: TimeSeries[]): number[] => {
  let values = [];
  series.map((timeSeries) => {
    values = [...timeSeries.values.map((e) => e.value), ...values];
  });
  return values;
};

export const LinearChart = ({ series, parseDate }: ILineChartProps) => {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    if (!dimensions) return;
    const margin = { top: 80, right: 40, bottom: 40, left: 80 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;
    // scales
    // Scale data. Make sure to use ScaleTime()
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(_mergeDates(series)))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(_mergeValues(series))])
      .range([height, 0]);

    // line generator
    const lineGen = d3
      .line()
      .x((d) => xScale(_parseDate(d.date)))
      .y((d) => yScale(d.value));

    // append g at svgRef.current
    svg
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw x axis.
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    svg
      .select('.x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    // Draw y axis.
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSizeOuter(0)
      .tickSizeInner(-width);

    svg.select('.y-axis').call(yAxis);

    // Draw Lines
    const chartGroup = svg.selectAll('.line-chart');
    chartGroup
      .selectAll('.line-series')
      .data(series)
      .join('path')
      .attr('class', `line-series`)
      .attr('d', (d) => lineGen(d.values))
      .style('fill', 'none')
      .style('stroke', (d) => d.color);
  }, [series, dimensions]);

  return (
    <div ref={wrapperRef}>
      <svg ref={svgRef} className={'bar-chart'} style={{ height: '500px' }}>
        <g className='x-axis' />
        <g className='y-axis' />
        <g className='line-chart' />
      </svg>
    </div>
  );
};
