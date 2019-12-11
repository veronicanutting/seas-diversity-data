var year7Data, year8Data, year9Data, year10Data, year11Data, year12Data, year13Data, year14Data, year15Data, year16Data, year17Data, year18Data;
var selectedData;
queue()
    .defer(d3.csv,"data/genderDatabyYear.csv")
    .await(createVis);

    function createVis(error, data) {
        if (error) {
            console.log(error);
        }

        data.forEach(function (d) {
            d.Male = +d.Male;
            d.Female = +d.Female;

        });

        var svgContainer = d3.select("#legend").append("svg")
            .attr("width", 300)
            .attr("height", 50);

        var female = svgContainer.append("rect")
            .attr("x", 10)
            .attr("y", 15)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill","#ff0000");

        var male = svgContainer.append("rect")
            .attr("x", 150)
            .attr("y", 15)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill","#f98425");

        var femaleText = svgContainer.append("text")
            .attr("x", 35)
            .attr("y", 25)
            .text("Female")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        var maleText = svgContainer.append("text")
            .attr("x", 175)
            .attr("y", 25)
            .text("Male")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");

        var margin = {top: 10, right: 50, bottom: 30, left: 450};

        var width = 900 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var svg = d3.select("#genderBarChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        year18Data = data.filter(d => d.Year == "2018");
        year17Data = data.filter(d => d.Year == "2017");
        year16Data = data.filter(d => d.Year == "2016");
        year15Data = data.filter(d => d.Year == "2015");
        year14Data = data.filter(d => d.Year == "2014");
        year13Data = data.filter(d => d.Year == "2013");
        year12Data = data.filter(d => d.Year == "2012");
        year11Data = data.filter(d => d.Year == "2011");
        year10Data = data.filter(d => d.Year == "2010");
        year9Data = data.filter(d => d.Year == "2009");
        year8Data = data.filter(d => d.Year == "2008");
        year7Data = data.filter(d => d.Year == "2007");

        var slider = document.getElementById('slider');

        noUiSlider.create(slider, {
            start: 2007,
            animate: false,
            range: {
                'min': 2007,
                'max': 2018
            },
            tooltips: true,
            format: wNumb({
                decimals: 0
            }),
            step: 1
        });

        $("#play").click(playVis);

        function playVis() {
            var id = window.setInterval(moveSlider, 1000);
            var yr = 2007;
            function moveSlider() {
                if(yr > 2018) {
                    window.clearInterval(id);
                } else {
                    slider.noUiSlider.set(yr);
                    yr++;
                }
            }
        }

        slider.noUiSlider.on('update', function(values, handle){
            var year = values[handle].toString();

            if (year == "2018") {
                selectedData = year18Data;
            }
            if (year == "2017") {
                selectedData = year17Data;
            }
            if (year == "2016") {
                selectedData = year16Data;
            }
            if (year == "2015") {
                selectedData = year15Data;
            }
            if (year == "2014") {
                selectedData = year14Data;
            }
            if (year == "2013") {
                selectedData = year13Data;
            }
            if (year == "2012") {
                selectedData = year12Data;
            }
            if (year == "2011") {
                selectedData = year11Data;
            }
            if (year == "2010") {
                selectedData = year10Data;
            }
            if (year == "2009") {
                selectedData = year9Data;
            }
            if (year == "2008") {
                selectedData = year8Data;
            }
            if (year == "2007") {
                selectedData = year7Data;
            }

// Scales
        var y = d3.scaleBand()
            .rangeRound([height, 0])
            .paddingInner(0.1);


        var x = d3.scaleLinear()
            .range([0, width]);

        var yAxis = d3.axisLeft()
            .scale(y);

        var yAxisGroup = svg.append("g")
            .attr("class", "y-axis axis");

        var xAxis = d3.axisBottom()
            .scale(x);

        var xAxisGroup = svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + height + ")");

        y.domain(selectedData.map(function (d) {
            return d.Concentration;
        }));

        x.domain([0, d3.max(selectedData, function (d) {
            return d.Male;
        })]);

        svg.select(".x-axis")
            .transition()
            .duration(500)
            .call(xAxis);

        svg.select(".y-axis")
            .transition()
            .duration(500)
            .call(yAxis);

        // append the rectangles for the bar chart
        var bars = svg.selectAll(".bar")
            .data(selectedData);

        // Enter (initialize the newly added elements)
        bars.enter().append("rect")
            .attr("class", "bar")

        // Enter and Update (set the dynamic properties of the elements)
            .merge(bars)
            .transition()
            .duration(500)
            .attr("y", function (d) {
                return y(d.Concentration);
            })
            .attr("height", y.bandwidth() / 2.5)
            .attr("width", function (d) {
                return x(d.Female);
            });
            // Exit
            bars.exit().remove();

        var newBars = svg.selectAll(".newBar")
            .data(selectedData);

        // Enter (initialize the newly added elements)
        newBars.enter().append("rect")
            .attr("class", "newBar")

            .merge(newBars)
            .transition()
            .duration(500)
            .attr("y", function (d) {
                return y(d.Concentration) + y.bandwidth() / 2.5;
            })
            .attr("height", y.bandwidth() / 2.5)
            .attr("width", function (d) {
                return x(d.Male);
            });

            newBars.exit().remove();

        });
    };