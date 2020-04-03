import * as React from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from 'hooks';
import './BarChart.scss';

const { useRef, useEffect } = React;

type TimeSeriesDataPoints = {
  date: Date,
  value: number;
}
type TimeSeries = {
  name: string,
  color: string,
  values: TimeSeriesDataPoints[]
};

interface ILineChartProps {
  series: TimeSeries[];
  dates: Date[];
  maxValue: number;
}

export const LinearChart = ({ series, dates, maxValue }: ILineChartProps) => {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    if (!dimensions) return;
    const margin = { top: 80, right: 40, bottom: 40, left: 80 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.left - margin.right;
    // scales
    // Scale data. Make sure to use ScaleTime()
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dates))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxValue])
      .range([height, 0]);

    // line generator
    const lineGen = d3
      .line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));

    // append g at svgRef.current
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw x axis.
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const xAxisDraw = svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'a axis')
      .call(xAxis);

    // Draw y axis.
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickSizeOuter(0)
      .tickSizeInner(-width);

    const yAxisDraw = svg
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis);
    // Draw Lines
    const chartGroup = svg.append('g').attr('class', 'line-chart');
    chartGroup
      .selectAll('.line-series')
      .data(series)
      .enter()
      .append('path')
      .attr('class', d => `line-series ${d.name.toLowerCase()}`)
      .attr('d', d => lineGen(d.values))
      .style('fill', 'none')
      .style('stroke', d => d.color);
  }, [series, dates, maxValue, dimensions]);

  return (
    <div ref={wrapperRef}>
      <svg ref={svgRef} className={'bar-chart'} style={{ height: '500px' }}>
        <g className='x-axis' />
        <g className='y-axis' />
      </svg>
    </div>
  );
};
