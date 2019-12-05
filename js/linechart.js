
// Create SVG drawing area
var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width_line = 700 - margin.left - margin.right,
    height_line = 500 - margin.top - margin.bottom;

var dataset = [];
var grouped_data = [];
var selected_group;

var svgLine = d3.select("#line-chart").append("svg")
    .attr("width", width_line + margin.left + margin.right)
    .attr("height", height_line + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.select("#concentration-box").on("change", updateVis);


queue()
    .defer(d3.json,"data/concs1.json")
    .await(createVis);

console.log("in line chart");

function createVis(error, data) {
    if (error) {
        console.log(error);
    }
    console.log(data);

    dataset = data;

    // Add X axis --> it is a date format
    var xScale = d3.scaleLinear()
        .domain("d3.extent(grouped_data, function(d) { return d.year; })")
        .range([ 0, width_line]);

    svgLine.append("g")
        .attr("transform", "translate(0," + height_line + ")")
        .call(d3.axisBottom(xScale).ticks(5));

    // Add Y axis
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.n; })])
        .range([ height_line, 0 ]);
    svgLine.append("g")
        .call(d3.axisLeft(yScale));

}

var data_to_use = [];

function updateVis() {
    selected_group = d3.select("#concentration-box").property("value");
    console.log(selected_group);

    grouped_data = dataset.filter(function(d) {
        return d.Group == selected_group;
    });

    console.log(grouped_data);




    /*
    // color palette
    var res = sumstat.map(function(d){ return d.key }) // list of group names
    var color = d3.scaleOrdinal()
        .domain(res)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    // Draw the line
    svgLine.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(+d.n); })
                (d.values)
        })

     */


}