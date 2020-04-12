import * as React from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from 'hooks';

const { useRef, useEffect } = React;
interface IBarChartProps {
  data: number[]; // should be an abitrary matrix with defined columns to calculate
}

export const Scatter = ({ data }: IBarChartProps) => {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const dimensions = useResizeObserver(wrapperRef);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    if (!dimensions) return;
    const margin = { top: 80, right: 40, bottom: 40, left: 80 };
    const width = dimensions.width - margin.right - margin.left;
    const height = dimensions.height - margin.top - margin.bottom;

    // need to extend the data extent a bit to not have data points on the origins
    const xExtent = d3.extent(data, (val, idx) => idx);
    // Scales.
    const xScale = d3
      .scaleLinear()
      .domain(xExtent)
      .range([0, width]);

    // need to extend the data extent with a bit more than xExtent, this depends on the data
    const yExtent = d3.extent(data, val => val);

    const yScale = d3
      .scaleLinear()
      .domain([0, yExtent[1]])
      .range([height, 0]);

    // Draw base.
    svg
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw x axis.
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(data.length)
    //   .tickSizeInner(-height)
      .tickSizeOuter(0);

    function addLabel(axis, label, x) {
      axis
        .selectAll('.tick:last-of-type text')
        .clone()
        .text(label)
        .attr('x', x) // pitfall: this x value is on top of the current cloned element
        .style('text-anchor', 'start')
        .style('font-weight', 'bold')
        .style('fill', '#555');
    }
    const xAxisDraw = svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .call(addLabel, 'X', 25);

    xAxisDraw.selectAll('text').attr('dy', '1em');

    // Draw y axis.
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(data.length)
    svg
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .call(addLabel, 'Y', 25);
    // Draw marks.
    svg
      .append('g')
      .attr('class', 'scatter-points')
      .selectAll('.scatter')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'scatter')
      .attr('cx', (val, idx) => xScale(idx))
      .attr('cy', (val) => yScale(val))
      .attr('r', 3)
      .style('fill', 'dodgerblue')
      .style('fill-opacity', 0.7);
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
      <svg ref={svgRef} className={'bar-chart'} style={{ height: '500px' }}>
        <g className='x-axis' />
        <g className='y-axis' />
      </svg>
    </div>
  );
};
