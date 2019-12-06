// Courtesy of https://blockbuilder.org/ebendennis/b441e21debcabbd83ae1ec25058aa78b

queue()
    .defer(d3.json,"data/raceData.json")
    .await(createVis);

function createVis(error, data) {
    if (error) {
        console.log(error);
    };

    var margin = {top: 75, right: 250, bottom: 75, left: 250};

    var width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    var svg = d3.select("#slopegraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y1 = d3.scaleLinear()
        .range([height, 0]);

    var config = {
        xOffset: 0,
        yOffset: 0,
        width: width,
        height: height,
        labelPositioning: {
            alpha: 0.5,
            spacing: 18
        },
        leftTitle: "SEAS",
        rightTitle: "FAS",
        labelGroupOffset: 5,
        labelKeyOffset: 50,
        radius: 6,
        // Reduce this to turn on detail-on-hover version
        unfocusOpacity: 0.8
    }

    function drawSlopeGraph(cfg, data, yScale, leftYAccessor, rightYAccessor) {
        var slopeGraph = svg.append("g")
            .attr("class", "slope-graph")
            .attr("transform", "translate(" + [cfg.xOffset, cfg.yOffset] + ")");
    }

        var y1Min = d3.min(data, function(d) {
            return Math.min(d.values.SEAS, d.values.FAS);
        });


        var y1Max = d3.max(data, function(d) {
            return Math.max(d.values.SEAS, d.values.FAS);
        });


        // Calculate y domain for ratios
        y1.domain([y1Min, y1Max]);

        var yScale = y1;

        // var voronoi = d3.voronoi()
        //     .x(width)
        //     .y(d => yScale(d.values)
        //     .extent([[-margin.left, -margin.top], [width + margin.right, height + margin.bottom]]);

        var borderLines = svg.append("g")
            .attr("class", "border-lines")
        borderLines.append("line")
            .attr("x1", 0).attr("y1", 0)
            .attr("x2", 0).attr("y2", config.height);
        borderLines.append("line")
            .attr("x1", width).attr("y1", 0)
            .attr("x2", width).attr("y2", config.height);

        var slopeGroups = svg.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
            .attr("class", "slope-group")
            .attr("id", function(d, i) {
                d.id = "group" + i;
                d.values.SEAS.group = this;
                d.values.FAS.group = this;
            });


        var slopeLines = slopeGroups.append("line")
            .attr("class", "slope-line")
            .attr("x1", 0)
            .attr("y1", function(d) {
                return y1(d.values.SEAS);
            })
            .attr("x2", config.width)
            .attr("y2", function(d) {
                return y1(d.values.FAS);
            });

        var leftSlopeCircle = slopeGroups.append("circle")
            .attr("r", config.radius)
            .attr("cy", d => y1(d.values.SEAS));

        var leftSlopeLabels = slopeGroups.append("g")
            .attr("class", "slope-label-left")
            .each(function(d) {
                d.xLeftPosition = -config.labelGroupOffset;
                d.yLeftPosition = y1(d.values.SEAS);
            });

        leftSlopeLabels.append("text")
            .attr("class", "label-figure")
            .attr("x", d => d.xLeftPosition)
            .attr("y", d => d.yLeftPosition)
            .attr("dx", -10)
            .attr("dy", 3)
            .attr("text-anchor", "end")
            .text(d => (d.values.SEAS));

        leftSlopeLabels.append("text")
            .attr("x", d => d.xLeftPosition)
            .attr("y", d => d.yLeftPosition)
            .attr("dx", -config.labelKeyOffset)
            .attr("dy", 3)
            .attr("text-anchor", "end")
            .text(d => d.key);

        var rightSlopeCircle = slopeGroups.append("circle")
            .attr("r", config.radius)
            .attr("cx", config.width)
            .attr("cy", d => y1(d.values.FAS));

        var rightSlopeLabels = slopeGroups.append("g")
            .attr("class", "slope-label-right")
            .each(function(d) {
                d.xRightPosition = width + config.labelGroupOffset;
                d.yRightPosition = y1(d.values.FAS);
            });

        rightSlopeLabels.append("text")
            .attr("class", "label-figure")
            .attr("x", d => d.xRightPosition)
            .attr("y", d => d.yRightPosition)
            .attr("dx", 10)
            .attr("dy", 3)
            .attr("text-anchor", "start")
            .text(d => d.values.FAS);

        rightSlopeLabels.append("text")
            .attr("x", d => d.xRightPosition)
            .attr("y", d => d.yRightPosition)
            .attr("dx", config.labelKeyOffset)
            .attr("dy", 3)
            .attr("text-anchor", "start")
            .text(d => d.key);

        var titles = svg.append("g")
            .attr("class", "title");

        titles.append("text")
            .attr("text-anchor", "end")
            .attr("dx", -10)
            .attr("dy", -margin.top / 2)
            .text(config.leftTitle);

        titles.append("text")
            .attr("x", config.width)
            .attr("dx", 10)
            .attr("dy", -margin.top / 2)
            .text(config.rightTitle);

        relax(leftSlopeLabels, "yLeftPosition");
        leftSlopeLabels.selectAll("text")
            .attr("y", d => d.yLeftPosition);

        relax(rightSlopeLabels, "yRightPosition");
        rightSlopeLabels.selectAll("text")
            .attr("y", d => d.yRightPosition);

        d3.selectAll(".slope-group")
            .attr("opacity", config.unfocusOpacity);

        // var voronoiGroup = svg.append("g")
        //     .attr("class", "voronoi");

        // var merge1 = data.map(d => ({SEAS: d.values.SEAS}));

        // var merge2 = data.map(d => ({FAS: d.values.FAS}));

        // voronoiGroup.selectAll("path")
        //     .data(voronoi.polygons(d3.merge([merge1, merge2])))
        //     .enter().append("path")
        //     .attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
        //     .on("mouseover", mouseover)
        //     .on("mouseout", mouseout);

    //
    // function mouseover(d) {
    //     d3.select(".slope-group").attr("opacity", 1);
    // }
    //
    // function mouseout(d) {
    //     d3.select(".slope-group")
    //         .attr("opacity", config.unfocusOpacity);
    // }

    // Function to reposition an array selection of labels (in the y-axis)
    function relax(labels, position) {
        again = false;
        labels.each(function (d, i) {
            a = this;
            da = d3.select(a).datum();
            y1 = da[position];
            labels.each(function (d, j) {
                b = this;
                if (a == b) return;
                db = d3.select(b).datum();
                y2 = db[position];
                deltaY = y1 - y2;

                if (Math.abs(deltaY) > config.labelPositioning.spacing) return;

                again = true;
                sign = deltaY > 0 ? 1 : -1;
                adjust = sign * config.labelPositioning.alpha;
                da[position] = +y1 + adjust;
                db[position] = +y2 - adjust;

                if (again) {
                    relax(labels, position);
                }
            })
        })
    };
}