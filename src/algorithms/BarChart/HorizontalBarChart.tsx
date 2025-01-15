import * as React from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from '../../hooks';
import createUseStyles from './BarChart.style';

const { useRef, useEffect } = React;
interface IBarChartProps {
  data: number[];
}

export const HorizontalBarChart = ({ data }: IBarChartProps) => {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const dimensions = useResizeObserver(wrapperRef);
  const { barchart } = createUseStyles();

  // will be called initially and on every data change
  useEffect(() => {
    const svg = d3.select(svgRef.current);

    if (!dimensions) return;
    const margin = { top: 80, right: 40, bottom: 40, left: 80 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.left - margin.right;
    // scales
    const xMax = d3.max(data);
    const xScale = d3
      .scaleLinear()
      .domain([0, xMax]) // scale from 0 to xMax
      .range([0, width]); // map to 0 to width pixels

    const yScale = d3
      .scaleBand()
      .domain(data.map((d, i) => i))
      .range([0, height])
      .paddingInner(0.25);

    const colorScale = d3
      .scaleLinear()
      .domain([75, 100, 150])
      .range(['green', 'orange', 'red'])
      .clamp(true);

    // append g at svgRef.current
    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // create and draw x-axis
    const xAxis = d3.axisTop(xScale).ticks(0);
    svg.select('.x-axis').call(xAxis);

    // create and draw y-axis
    const yAxis = d3.axisLeft(yScale).tickSize(data.length);
    svg.select('.y-axis').call(yAxis);

    // draw bars
    const bars = svg
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('y', (d, idx) => yScale(idx))
      .attr('height', yScale.bandwidth());

    // add tooltips on mouseenter event
    bars.on('mouseenter', (val, idx) => {
      svg
        .selectAll('.tooltip')
        .data([val])
        .join((enter) => enter.append('text').attr('x', xScale(val) + 4))
        .attr('class', 'tooltip')
        .text(val)
        .attr('y', yScale(idx) + yScale.bandwidth() / 1.75) // @todo: this is not perfectly in the middle
        .transition()
        .attr('x', xScale(val) + 10)
        .attr('opacity', 1);
    });

    // remove tooltips on mouseleave event
    bars.on('mouseleave', () => svg.select('.tooltip').remove());

    // add transitions
    bars
      .transition()
      .attr('fill', colorScale)
      .attr('width', (d) => xScale(d));
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef}>
      <svg ref={svgRef} className={barchart} style={{ height: '500px' }}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
};
