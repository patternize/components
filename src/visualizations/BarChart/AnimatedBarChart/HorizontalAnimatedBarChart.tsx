import * as React from 'react';
import * as d3 from 'd3';
import { useResizeObserver } from 'hooks';

const { useRef, useEffect } = React;
type BarchartDatapoint = {
  value: number; // height/width of the bar
  index: number | string; // position of the bar
};

interface IHorizontalAnimatedBarChartProps {
  data: BarchartDatapoint[];
}

export const HorizontalAnimatedBarChart = ({
  data,
}: IHorizontalAnimatedBarChartProps) => {
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
    const xMax = d3.max(data.map((d) => d.value));
    const xScale = d3
      .scaleLinear()
      .domain([0, xMax]) // scale from 0 to xMax
      .range([0, width]); // map to 0 to width pixels

    const yScale = d3
      .scaleBand()
      .domain(data.map((d, idx) => idx))
      .range([0, height])
      .paddingInner(0.25);

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

    // add transition
    const t = d3.transition().duration(500);

    // draw bars
    const bars = svg
      .selectAll('.bar')
      .data(data, (d) => d.value)
      .join(
        (enter) => {
          enter
            .append('rect')
            .attr('class', 'bar')
            .attr('y', (d, idx) => yScale(d.index))
            .attr('width', (d) => xScale(d.value))
            .attr('fill', 'grey')
            .attr('height', yScale.bandwidth());
        },
        (update) => {
          debugger;
          update
            .transition(t)
            .delay((d, i) => i * 20)
            .attr('y', (d) => yScale(d.index))
            .attr('fill', (d) => d.color)
            .attr('width', (d) => xScale(d.value));
        },
        (exit) => {}
      );

    // add tooltips on mouseenter event
    d3.selectAll('.bar')
      .on('mouseenter', (d, idx) => {
        svg
          .selectAll('.tooltip')
          .data([d.value])
          .join((enter) => enter.append('text').attr('x', xScale(d.value) + 4))
          .attr('class', 'tooltip')
          .text(d.value)
          .attr('y', yScale(idx) + yScale.bandwidth() / 1.75) // @todo: this is not perfectly in the middle
          .transition()
          .attr('x', xScale(d.value) + 10)
          .attr('opacity', 1);
      })
      // // remove tooltips on mouseleave event
      .on('mouseleave', () => svg.select('.tooltip').remove());
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef}>
      <svg ref={svgRef} className={'bar-chart'} style={{ height: '500px' }}>
        <g className='x-axis' />
        <g className='y-axis' />
      </svg>
    </div>
  );
};
