import * as React from 'react';
import { select, line, curveCardinal, scaleLinear, axisBottom, axisRight } from 'd3';

const { useRef, useEffect, useState } = React;

interface IProps {
    data: number[];
}

/* Component */
export const Line = (props: IProps): JSX.Element => {
    const [data, setData] = useState(props.data);
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = select(svgRef.current);
        const xScale = scaleLinear()
            .domain([0, data.length - 1])
            .range([0, 500]);

        const yScale = scaleLinear()
            .domain([0, 150])
            .range([150, 0]);

        const xAxis = axisBottom(xScale)
            .ticks(data.length)
            .tickFormat(index => index + 1);
        svg
            .select(".x-axis")
            .style("transform", "translateY(150px)")
            .call(xAxis);

        const yAxis = axisRight(yScale);
        svg
            .select(".y-axis")
            .style("transform", "translateX(300px)")
            .call(yAxis);

        // generates the "d" attribute of a path element
        const myLine = line()
            .x((value, index) => xScale(index))
            .y(yScale)
            .curve(curveCardinal);

        // renders path element, and attaches
        // the "d" attribute from line generator above
        svg
            .selectAll(".line")
            .data([data])
            .join("path")
            .attr("class", "line")
            .attr("d", myLine)
            .attr("fill", "none")
            .attr("stroke", "blue");
    }, [data]);

    return (
        <React.Fragment>
            <svg width={500} height={300} ref={svgRef} style={{  overflow: 'visible'}}>
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
            <br />
            <br />
            <br />
            <br />
            <button onClick={() => setData(data.map(value => value + 5))}>
                Update data
            </button>
            <button onClick={() => setData(data.filter(value => value < 35))}>
                Filter data
            </button>
        </React.Fragment>
    );

}
