
// Create SVG drawing area
var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width_line = 700 - margin.left - margin.right,
    height_line = 500 - margin.top - margin.bottom;

// Global variables
var dataset = [];
var selected_group;
var grouped_data = [];
var xScale;
var xAxis;
var yScale;
var yAxis;

var svgLine = d3.select("#line-chart").append("svg")
    .attr("width", width_line + margin.left + margin.right)
    .attr("height", height_line + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Listen for selectbox changes
d3.select("#concentration-box").on("change", updateVis);

var parseTime = d3.timeParse("%Y");

queue()
    .defer(d3.json,"data/cons2.json")
    .await(createVis);

function createVis(error, data) {
    if (error) {
        console.log(error);
    }

    // Parse data
    dataset = data;
    dataset.forEach(function(d){
        d["Year Awarded"] = parseTime(d["Year Awarded"]);
    });

    // X Scale
    xScale = d3.scaleTime()
        .range([0, width_line])
        .domain(d3.extent(dataset, function(d) { return d["Year Awarded"]; }));

    // X axis
    xAxis = d3.axisBottom()
        .scale(xScale);
    svgLine.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + height_line + ")")
        .call(xAxis);

    // X axis label
    svgLine.append("text")
        .attr("class", "axis-title")
        .attr("x", width_line)
        .attr("y",  height_line + 40)
        .style("text-anchor", "end")
        .text("Year Awarded");

    // X Scale
    yScale = d3.scaleLinear()
        .range([height_line, 0])
        .domain([0,100]);

    // Y axis
    yAxis = d3.axisLeft()
        .scale(yScale);
    svgLine.append("g")
        .attr("class", "y-axis axis")
        .call(yAxis);

    // Y axis label
    svgLine.append("text")
        .attr("class", "y label")
        .attr("x", 0)
        .attr("y", 40)
        .attr("transform", "rotate(90)")
        .attr("dy", "-.1em")
        .style("text-anchor", "start")
        .text("Degrees Awarded");

}

function updateVis() {

    // Group data based on group selected
    selected_group = d3.select("#concentration-box").property("value");
    console.log(selected_group);
    grouped_data = dataset.filter(function(d) {
        return d.Group == selected_group;
    });
    console.log(grouped_data);


    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d["Year Awarded"];})
        .entries(grouped_data);

    console.log(dataNest);

    // Update y scale and axis
    yScale
        .domain([0,50]);
    yAxis
        .scale(yScale);
    svgLine.select(".y-axis")
        .transition()
        .duration(800)
        .call(yAxis);

    var color = d3.scaleOrdinal()
        .domain(res)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999']);

    // Draw the line
    svgLine.selectAll(".line")
        .data(grouped_data)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return xScale(d["Year Awarded"]); })
                .y(function(d) { return yScale(+d.n); })
                (d.values)
        })

}