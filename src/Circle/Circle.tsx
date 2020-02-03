import * as React from 'react';
import { select } from 'd3';

const { useRef, useEffect, useState } = React;

interface IProps {
    data: number[];
}

/* Component */
export const Circle = (props: IProps): JSX.Element => {
    const [data, setData] = useState(props.data);
    const svgRef = useRef(null);

    /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
    useEffect(() => {
        const svg = select(svgRef.current);
        svg.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("r", val => val)
            .attr("cx", val => val*2)
            .attr("cy", val => val*2)
            .attr("stroke", "red")
    }, [data]);

    return (
        <>
            <svg ref={svgRef}/>
            <button onClick={() => setData(data.map(value => value + 5))} > Update Data </button>
            <button onClick={() => setData(data.filter(value => value < 35))} > Filter Data </button>
        </>
    );
};
