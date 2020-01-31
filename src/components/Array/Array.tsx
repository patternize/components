import * as React from 'react';
import * as d3 from 'd3';

const { useState, useRef, useEffect } = React;
const { select } = d3;

interface IProps {
    data: number[][];
}

/* Component */
export const Array = (props: IProps): JSX.Element => {
    const [index, setIndex] = useState(0);

    const svgRef = useRef(null);

    useEffect(
        () => {
            if (props.data && svgRef.current) {
                console.log(data[index]);
                const svg = select(svgRef.current);
                svg.attr("width", 300)
                    .attr("height", 33)
                    .attr("viewBox", `0 -20 ${300} 33`);
                const t = svg.transition()
                    .duration(750);

                svg.selectAll("text")
                    .data(data[index], d => d)
                    .join(
                        enter => enter.append("text")
                            .attr("fill", "green")
                            .attr("x", (d, i) => i * 18)
                            .attr("y", -30)
                            .style('font-size', 24)
                            .text(d => d)
                            .call(enter => enter.transition(t)
                            .attr("y", 0)),
                        update => update
                            .attr("fill", "black")
                            .attr("y", 0)
                            .call(update => update.transition(t)
                                .attr("x", (d, i) => i * 18)),
                        exit => exit
                            .attr("fill", "brown")
                            .call(exit => exit.transition(t)
                                .attr("y", 30)
                                .remove())
                    );
            }
        }, [index]);

    const { data } = props;

    return (
        <>
            <svg
                className="d3-component"
                ref={svgRef}
            />
            <br/>
            <button onClick={() => setIndex(index-1)} disabled={index == 0}>
                Previous
            </button>
            <button onClick={() => setIndex(index+1)} disabled={index == data.length - 1}>
                Next
            </button>
        </>
    );

}
