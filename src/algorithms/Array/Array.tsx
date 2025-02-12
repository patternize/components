import * as d3 from 'd3';
import * as React from 'react';
// import { useLocalStorage } from 'hooks';
import useStyles from './Array.style';

const { useRef, useEffect } = React;
const { select } = d3;

interface ColorRange {
  start: number;
  end: number;
  color: string;
}

export const Array: React.FC<{
  data: number[];
  colorRanges?: ColorRange[];
}> = ({ data, colorRanges = [] }) => {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);

  const { array } = useStyles();

  useEffect(() => {
    if (data && svgRef.current) {
      const svg = select(svgRef.current);

      // Calculate width based on number of digits
      const getTextWidth = (num: number) => {
        const digits = Math.abs(num).toString().length;
        return digits <= 1 ? 35 : digits <= 2 ? 45 : 55; // Wider space for 2+ digits
      };

      // Calculate total width by summing up individual number widths
      const totalWidth = data.reduce((acc, num) => acc + getTextWidth(num), 0);
      svg.attr('width', totalWidth).attr('height', 33);

      const t = svg.transition().duration(750);

      // Keep track of cumulative x position
      let xPosition = 0;
      const positions = data.map((num) => {
        const pos = xPosition;
        xPosition += getTextWidth(num);
        return pos;
      });

      // Get color for index based on colorRanges
      const getColor = (index: number) => {
        const range = colorRanges.find(
          (r) => index >= r.start && index <= r.end
        );
        return range ? range.color : 'black';
      };

      svg
        .selectAll('text')
        .data(data, (d) => d)
        .join(
          (enter) =>
            enter
              .append('text')
              .attr('fill', (_, i) => getColor(i))
              .attr('x', (_, i) => positions[i])
              .attr('y', -30)
              .style('font-size', 24)
              .text((d) => d)
              .call((enter) => enter.transition(t).attr('y', 0)),
          (update) =>
            update
              .attr('class', 'text')
              .attr('fill', (_, i) => getColor(i))
              .attr('y', 0)
              .call((update) =>
                update.transition(t).attr('x', (_, i) => positions[i])
              ),
          (exit) =>
            exit
              .attr('fill', 'brown')
              .call((exit) => exit.transition(t).attr('y', 30).remove())
        );
    }
  }, [data, colorRanges]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
      <svg className={array} ref={svgRef} />
    </div>
  );
};
