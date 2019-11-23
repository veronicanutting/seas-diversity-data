// Courtesy of https://codepen.io/thecraftycoderpdx/pen/rJYNRv?editors=0010#0

queue()
	//.defer(d3.csv,"data/2018ASEETotals.csv")
	.defer(d3.json,"data/totalsunburst.json")
	.await(createVis);

function createVis(error, data){
	if(error) { console.log(error); };

	console.log(data);

// set width, height, and radius
	var width = 325,
		height = 325,
		radius = (Math.min(width, height) / 2) - 10; // lowest number divided by 2. Then subtract 10

// legend dimensions
	//var legendRectSize = 15; // defines the size of the colored squares in legend
	//var legendSpacing = 6; // defines spacing between squares

	var formatNumber = d3.format(",d"); // formats floats

	var x = d3.scaleLinear() // continuous scale. preserves proportional differences
		.range([0, 2 * Math.PI]); // setting range from 0 to 2 * circumference of a circle

	var y = d3.scaleSqrt() // continuous power scale
		.range([0, radius]); // setting range from 0 to radius

	var partition = d3.partition(); // subdivides layers

// define arcs
	var arc = d3.arc()
		.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
		.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
		.innerRadius(function(d) { return Math.max(0, y(d.y0)); })
		.outerRadius(function(d) { return Math.max(0, y(d.y1)); });

//**********************
//        TOOLTIP
//**********************

// define tooltip
	//var tooltip = d3.select('#chart') // select element in the DOM with id 'chart'
		//.append('div').classed('tooltip', true); // append a div element to the element we've selected
	//tooltip.append('div') // add divs to the tooltip defined above
		//.attr('class', 'label'); // add class 'label' on the selection
	//tooltip.append('div') // add divs to the tooltip defined above
		//.attr('class', 'count'); // add class 'count' on the selection
	//tooltip.append('div') // add divs to the tooltip defined above
		//.attr('class', 'percent'); // add class 'percent' on the selection

	var tooltip = d3.tip()
		.attr("class", "d3-tip")
		.offset([-10, 0]);


//**********************
//        CHART
//**********************
// prep the data
	var root = d3.hierarchy(data);

// calculate total
	var total = 0

// must call sum on the hierarchy first
// and as we're doing that, total up the sum of the chart
	root.sum(function(d) {
		if (d.size) {
			total += d.size
		}
		return d.size;
	});

// enable data as true true
	root.data.children.forEach(function(d){
		d.enabled = true;
	})

// define SVG element
	var svg = d3.select("#chart").append("svg")
		.attr("width", width) // set width
		.attr("height", height) // set height
		.append("g") // append g element
		.attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

	svg.call(tooltip);

// redraw(root);
	var path = svg.selectAll("path")
		.data(partition(root).descendants()) // path for each descendant
		.enter().append("path")
		.attr("d", arc) // draw arcs
		.attr("class", "path")
		.style("fill", function (d) { return (d.children ? d : d.parent).data.color; })
		.on("click", click)
		.on('mouseover', function(d) {
			tooltip.select('.label').html(d.data.name); // set current label
			tooltip.style('display', 'block'); // set display
		})
		.on('mouseout', function() { // when mouse leaves div
			tooltip.style('display', 'none'); // hide tooltip for that element
		})
		.on('mousemove', function(d) { // when mouse moves
			tooltip.style('top', (d3.event.layerY + 10) + 'px'); // always 10px below the cursor
			tooltip.style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
		});

	d3.select(self.frameElement).style("height", height + "px");

	svg.append("text")
		.attr("class", "total")
		.attr("text-anchor", "middle")
		.attr('font-size', '4em')
		.attr('y', 20)
		.text(total);


// zoom on click
	function click(d) {
		svg.transition()
			.duration(750) // duration of transition
			.tween("scale", function() {
				var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
					yd = d3.interpolate(y.domain(), [d.y0, 1]),
					yr = d3.interpolate(y.range(), [d.y0 ? (80) : 0, radius]);
				return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
			})
			.selectAll("path")
			.attrTween("d", function(d) { return function() { return arc(d); }; });
		d3.select(".total").text(d.value);
	}

};


