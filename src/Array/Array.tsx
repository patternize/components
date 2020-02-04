import * as React from 'react';
import * as d3 from 'd3';
// import { useResizeObserver } from 'hooks';
import "./Array.scss";

const { useRef, useEffect } = React;
const { select } = d3;

interface ArrayProps {
    data: number[]; // This component only takes in a number array as data
}

/* Component */
export const Array = (props: ArrayProps): JSX.Element => {

    const svgRef = useRef(null);
    const wrapperRef = useRef(null);
    // const dimensions = useResizeObserver(wrapperRef);

    const { data } = props;

    useEffect(
        () => {
            if (data && svgRef.current) {
                const svg = select(svgRef.current);
                const textWidth = 18;
                const totalWidth = textWidth * data.length;
                svg.attr("width", totalWidth)
                    .attr("height", 33)

                const t = svg.transition()
                    .duration(750);

                svg.selectAll("text")
                    .data(data, d => d)
                    .join(
                        enter => enter.append("text")
                            .attr("fill", "green")
                            .attr("x", (d, i) => i * textWidth)
                            .attr("y", -30)
                            .style('font-size', 24)
                            .text(d => d)
                            .call(enter => enter.transition(t)
                            .attr("y", 0)),
                        update => update
                            .attr("fill", "black")
                            .attr("y", 0)
                            .call(update => update.transition(t)
                                .attr("x", (d, i) => i * textWidth)
                            ),
                        exit => exit
                            .attr("fill", "brown")
                            .call(exit => exit.transition(t)
                                .attr("y", 30)
                                .remove())
                    );
            }
        }, [data]);

    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg
                className="array"
                ref={svgRef}
            />
        </div>
    );
}
