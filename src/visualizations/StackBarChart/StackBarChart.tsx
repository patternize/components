import * as React from "react";
import * as d3 from "d3";

const { useRef, useEffect } = React;

interface IStackBarChartProps {
    data: number[];
}

export const StackBarChart = ({ data }: any) => {
    const svgRef = useRef(null);
    const wrapperRef = useRef(null);
    const dimensions = useResizeObserver(wrapperRef);

    let margin = {top: 20, right: 20, bottom: 30, left: 40};
    var x = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var xAxis = d3.axisBottom(x);

    function update(data, keys) {
      data = [...data];
      const sortFn = (a, b) => d3.ascending(a.State, b.State);
      const xCopy = x.domain(data.sort(sortFn).map(d => d.State)).copy();
      const t = d3.transition().duration(750);
      const delay = (d, i) => i * 20;

      const groups = d3.selectAll("g.bar-group")
        .data(d3.stack().keys(keys)(data))
        .attr("fill", function(d) { return z(d.key); });

      const bars = groups.selectAll(".bar")
        .data(d => d, d => d.data.State)
        .sort((a, b) => xCopy(a.data.State) - xCopy(b.data.State))

      t.selectAll("g.bar-group")
        .selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return xCopy(d.data.State)})

      t.select(".axis.x")
        .call(xAxis)
        .selectAll("g")
        .delay(delay)
    }

    // will be called initially and on every data change
    useEffect(() => {
      const svg = d3.select(svgRef.current);
      let width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom,
          g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      if (!dimensions) return;

      var keys = data.columns.slice(1);

      data.sort(function(a, b) { return b.total - a.total; });
      x.domain(data.map(function(d) { return d.State; }));
      y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
      z.domain(keys);

      g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
            .classed("bar-group", true)
          .attr("fill", function(d) { return z(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; }, d => d.data.State)
        .enter().append("rect")
            .classed("bar", true)
          .attr("x", function(d) { return x(d.data.State); })
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          .attr("width", x.bandwidth());

      g.append("g")
          .attr("class", "axis x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      g.append("g")
          .attr("class", "axis y")
          .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
          .attr("x", 2)
          .attr("y", y(y.ticks().pop()) + 0.5)
          .attr("dy", "0.32em")
          .attr("fill", "#000")
          .attr("font-weight", "bold")
          .attr("text-anchor", "start")
          .text("Population");

      var legend = g.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", z);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text(function(d) { return d; });
    }, [data, dimensions]);

    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef} width={900} height={500}>
            </svg>
        </div>
    );
}
