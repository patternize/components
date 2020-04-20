import * as React from "react";
import * as d3 from "d3";
import { useResizeObserver } from "hooks";

const { useRef, useEffect } = React;

// interface IStackBarChartProps {
//     data: number[];
// }

// const randInt = (min, max) => {
//     let range = max - min;
//     let rnd = Math.random() * range + min;
//     return Math.round(rnd);
// }

export const StackBarChart = () => {
    const svgRef = useRef(null);
    const wrapperRef = useRef(null);
    const dimensions = useResizeObserver(wrapperRef);

    const data = [
        [2007, "Inpatient Care", 65830],
        [2007, "Outpatient Care", 22742],
        [2007, "Medication and Supplies", 27684],
        [2007, "Reduced Productivity", 23400],
        [2007, "Reduced Labor Force", 7900],
        [2007, "Early Mortality", 26900],
        [2012, "Inpatient Care", 90652],
        [2012, "Outpatient Care", 31798],
        [2012, "Medication and Supplies", 52306],
        [2012, "Reduced Productivity", 28500],
        [2012, "Reduced Labor Force", 21600],
        [2012, "Early Mortality", 18500],
        [2017, "Inpatient Care", 76164],
        [2017, "Outpatient Care", 54001],
        [2017, "Medication and Supplies", 107104],
        [2017, "Reduced Productivity", 32500],
        [2017, "Reduced Labor Force", 37500],
        [2017, "Early Mortality", 19900]
    ].map(row => {
        return {
            year: +row[0],
            source: row[1],
            cost: +row[2]
        };
    });

    const width = 900;
    const height = 500;
    const margin = {
        top: 20,
        left: 120,
        right: 20,
        bottom: 20
    }

    const years = data.map(d => d.year).sort().reduce((prev: any[], curr: any) => {
        if (prev.indexOf(curr) === -1) {
            prev.push(curr);
        }
        return prev;
    }, []);

    const yearSort = (a, b) => {
        return b.cost - a.cost;
    }

    const sources = data.map(d => d.source).sort().reduce((prev: any[], curr) => {
        if (prev.indexOf(curr) === -1) {
            prev.push(curr);
        }
        return prev;
    }, []);

    const color = (source) => {
        let colors = sources.map((source, i) => {
            return {
                source: source,
                color: d3.schemeSet2[i]
            };
        });
        let found = colors.find(c => c.source === source);
        return (found) ? found.color : "black";
    }

    const y = d3.scaleBand()
        .domain(sources)
        .range([0, height - margin.top - margin.bottom])
        .padding(0.2)

    const yAxis = (g) => {
        return g.attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(d3.axisLeft(y).tickSizeInner(0).tickSizeOuter(0));
    }

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cost)])
        .range([0, width - margin.left - margin.right])
        .nice()

    const xAxis = (g) => {
        return g.attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));
    }

    const fontFamily = "Arial, sans-serif"

    const format = (x) => {
        let suffix = "";
        if (x > 1e9) {
            x /= 1e9;
            suffix = "B";
        }
        else if (x > 1e6) {
            x /= 1e6;
            suffix = "M";
        }
        else if (x > 1e3) {
            x /= 1e3;
            suffix = "k";
        }
        return "US$" + (x).toFixed(0) + suffix;
    }

    const titleText = (yearData) => {
        let year = yearData[0].year;
        let values = yearData.map(d => d.cost * 1e3);
        let sum = d3.sum(values);
        return `US Diabetes Spending, ${year}, ${format(sum)}`;
    }

    const titleFontSize = 16

    const timerInterval = 2000;

    const transitionDuration = 500


    // will be called initially and on every data change
    useEffect(() => {
        let yearIndex = 0;
        let yearData = data.filter(d => d.year === years[yearIndex])
            .sort(yearSort);

        y.domain(yearData.map(d => d.source));

        const svg = d3.select(svgRef.current);
        svg.attr('font-family', fontFamily);

        let gView = svg.append("g")
            .classed("view", true)
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // Draw the bars.
        let bars = gView.selectAll("rect")
            .data(yearData)
            .join("rect")
            .attr("fill", d => color(d.source))
            .attr("x", 0)
            .attr("y", d => y(d.source))
            .attr("width", d => x(d.cost))
            .attr("height", y.bandwidth());

        // Draw the title.
        let title = svg.append("g")
            .classed("title", true)
            .attr("transform", `translate(${margin.left}, 0)`)
            .append("text")
            .classed("title", true)
            .attr("y", titleFontSize)
            .text(d => titleText(yearData));

        svg.append("g")
            .classed("x-axis", true)
            .call(xAxis);

        let gy = svg.append("g")
            .classed("y-axis", true)
            .call(yAxis);

        setInterval(() => {
            let t = svg.transition()
                .duration(transitionDuration);

            // Increment the year index. If the new index exceeds the length of the
            // the number of years, then go back to index 0.
            yearIndex++;
            if (yearIndex >= years.length) {
                yearIndex = 0;
            }

            let yearData = data.filter(d => d.year === years[yearIndex])
                .sort(yearSort);

            y.domain(yearData.map(d => d.source));

            gy.transition(t)
                .call(yAxis);

            bars.data(yearData, d => d.source)
                .transition(t)
                .attr("y", d => y(d.source))
                .attr("width", d => x(d.cost));

            // Update the title.
            title.text(titleText(yearData));

        }, timerInterval);

    }, [dimensions]);

    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef} width={900} height={500}>
            </svg>
        </div>
    );
};
