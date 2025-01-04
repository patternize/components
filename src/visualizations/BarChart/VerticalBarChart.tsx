import { axisBottom, axisRight, scaleBand, scaleLinear, select } from 'd3';
import * as React from 'react';
import { useResizeObserver } from '../../hooks';
import createUseStyles from './BarChart.style';

const { useRef, useEffect } = React;
interface IBarChartProps {
  data: number[];
}

export const VerticalBarChart = ({ data }: IBarChartProps) => {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const dimensions = useResizeObserver(wrapperRef);
  const { barchart } = createUseStyles();

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    if (!dimensions) return;

    // scales
    const xScale = scaleBand()
      .domain(data.map((value, index) => index))
      .range([0, dimensions.width]) // change
      .padding(0.5);

    const yScale = scaleLinear()
      .domain([0, Math.max(...data)])
      .range([dimensions.height, 0]); // change

    const colorScale = scaleLinear()
      .domain([75, 100, 150])
      .range(['green', 'orange', 'red'])
      .clamp(true);

    // create x-axis
    const xAxis = axisBottom(xScale).ticks(data.length);
    svg
      .select('.x-axis')
      .style('transform', `translateY(${dimensions.height}px)`)
      .call(xAxis);

    // create y-axis
    const yAxis = axisRight(yScale);
    svg
      .select('.y-axis')
      .style('transform', `translateX(${dimensions.width}px)`)
      .call(yAxis);

    // draw the bars
    svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .style('transform', 'scale(1, -1)')
      .attr('x', (value, index) => xScale(index))
      .attr('y', -dimensions.height)
      .attr('width', xScale.bandwidth())
      .on('mouseenter', (event, value) => {
        // Add value label above bar
        const index = data.indexOf(value);
        svg
          .selectAll('.value-label')
          .data([value])
          .join('text')
          .attr('class', 'value-label')
          .text(value)
          .attr('x', xScale(index) + xScale.bandwidth() / 2)
          .attr('y', yScale(value) - 5)
          .attr('text-anchor', 'middle')
          .attr('opacity', 0)
          .transition()
          .duration(200)
          .attr('opacity', 1);
      })
      .on('mouseleave', () => {
        svg.selectAll('.value-label').remove();
      })
      .transition()
      .attr('fill', colorScale)
      .attr('height', (value) => dimensions.height - yScale(value));
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
      <svg ref={svgRef} className={barchart}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};
