import * as React from 'react';
import { select, hierarchy, tree, linkHorizontal } from 'd3';
import { useResizeObserver, usePrevious } from 'hooks';
import './TreeChart.scss';

const { useRef, useEffect } = React;

export function TreeChart({ data }) {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null as any);
  const dimensions = useResizeObserver(wrapperRef);

  // use usePrevious hook to see if data has been changed
  const previouslyRenderedData = usePrevious(data);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    /*
            initial render doesn't have dimensions, so we need to use getBoundingClientRect
         */
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // transform hierarchical data
    const root = hierarchy(data);
    const treeLayout = tree().size([height, width - 100]);

    // give linkVertical source node and target node
    const linkGenerator = linkHorizontal()
      .source(link => link.source) // this is by default, don't need to specify
      .target(link => link.target) // this is by default, don't need to specify
      .x(node => node.y)
      .y(node => node.x);

    // get coordinates for hierarchical data
    treeLayout(root);

    // render nodes
    svg
      .selectAll('.node')
      .data(root.descendants())
      .join(enter => enter.append('circle').attr('opacity', 0))
      .attr('class', 'node')
      .attr('cx', node => node.y)
      .attr('cy', node => node.x)
      .attr('r', 4)
      .transition()
      .duration(500)
      .delay(node => node.depth * 300)
      .attr('opacity', 1);

    // add links
    const enteringAndUpdatingLinks = svg
      .selectAll('.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr('d', linkGenerator)
      .attr('stroke-dasharray', function(this: any) {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('opacity', 1);

    if (data !== previouslyRenderedData) {
      enteringAndUpdatingLinks
        .attr('stroke-dashoffset', function(this: any) {
          return this.getTotalLength();
        })
        .transition()
        .duration(500)
        .delay(link => link.source.depth * 500)
        .attr('stroke-dashoffset', 0);
    }

    // add labels
    svg
      .selectAll('.label')
      .data(root.descendants())
      .join(enter => enter.append('text').attr('opacity', 0))
      .attr('class', 'label')
      .attr('x', node => node.y)
      .attr('y', node => node.x - 12)
      .text(node => node.data.name)
      .transition()
      .duration(500)
      .delay(node => node.depth * 300)
      .attr('opacity', 1);
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
      <svg ref={svgRef} className={'tree-chart'} height={700} />
    </div>
  );
}
