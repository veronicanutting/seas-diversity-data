queue()
    .defer(d3.json,"data/totalsunburst.json")
    .await(createVis);

function createVis(error, data) {
    if (error) {
        console.log(error);
    };

    var margin = {top: 100, right: 275, bottom: 40, left: 275};

    var width = 500 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#slopegraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


}