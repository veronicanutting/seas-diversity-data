
// Create SVG drawing area
var margin = {top: 40, right: 80, bottom: 60, left: 60};

var width2 = 1200 - margin.left - margin.right,
	height2 = 1000 - margin.top - margin.bottom;

var svgArea = d3.select("#stack-chart").append("svg")
	.attr("width", width2 + margin.left + margin.right)
	.attr("height", height2 + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Overlay with path clipping
svgArea.append("defs").append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", width2)
	.attr("height", height2);


var datasetConcentration = [];

var dataCategories = ["Art Film and Visual Studies","Classics","Comparative Literature",
	"English","Folklore and Mythology","Germanic Languages and Literatures",
	"History and Literature","History of Art and Architecture","Linguistics",
	"Music","Near Eastern Languages and Civilizations","Philosophy",
	"Romance Languages and Literatures","Slavic Languages and Literatures",
	"South Asian Studies","Theater Dance and Media",
	"Applied Mathematics","Biomedical Engineering","Computer Science",
	"Electrical Engineering","Engineering Sciences","Environmental Science and Engineering",
	"Mechanical Engineering","Astronomy","Chemical and Physical Biology",
	"Chemistry","Chemistry and Physics","Earth and Planetary Sciences",
	"Environmental Science and Public Policy","Human Developmental and Regenerative Biology",
	"Human Evolutionary Biology","Integrative Biology","Mathematics","Molecular and Cellular Biology",
	"Neuroscience","Physics","Statistics","African and African American Studies",
	"Anthropology","Comparative Study of Religion","East Asian Studies",
	"Economics","Government","History","History and Science","Psychology",
	"Social Studies","Sociology","Studies of Women Gender and Sexuality","Special Concentrations"];

// 17 through 23

// var colorScale = d3.scaleOrdinal(d3.schemeReds[30])
// 	.domain(dataCategories);

// Try this!
// var colors = dataCategories.map(function (d, i) {
// 	return d3.interpolateRdYlBu(i / dataCategories.length);
// });

var colors = ['#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b',
	'#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b',

	'#fee5d9','#fcbba1','#fc9272','#fb6a4a', '#ef3b2c','#cb181d','#99000d',

	'#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b',
	'#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b',
	'#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#034e7b',
	'#fff7fb','#ece7f2','#d0d1e6'];

// var colorScale = d3.scaleOrdinal()
// 	.domain(dataCategories)
// 	.range(colors);

var parseTime = d3.timeParse("%Y");

// d3.select("#combo-box").on("change", updateColor);

d3.csv("data/newConcentrationData.csv", function(data) {

	datasetConcentration = data;

	datasetConcentration.forEach(function(d){

		// Parse data
		d.Year = parseTime(d.Year);

		Object.keys(d).forEach(function (key) {
			if (key != "Year") {
				d[key] = +d[key];
			}
		})

	});
	console.log(datasetConcentration);
	//console.log(datasetConcentration);

	// Scales and axes
	var x = d3.scaleTime()
		.range([0, width2 - 20])
		.domain(d3.extent(datasetConcentration, function(d) { return d.Year; }));

	var y = d3.scaleLinear()
		.range([height2, 0])
		.domain([0, 2000]);

	var xAxis = d3.axisBottom()
		//.ticks(5)
		.scale(x);

	var yAxis = d3.axisLeft()
		.scale(y);

	svgArea.append("text")
		.attr("class", "axis-title")
		.attr("x", 0)
		.attr("y", -5)
		.attr("transform", "rotate(90)")
		.attr("dy", "-.1em")
		.style("text-anchor", "start")
		.text("Degrees");

	svgArea.append("g")
		.attr("class", "x-axis axis")
		.attr("transform", "translate(0," + height2 + ")")
		.call(xAxis);

	svgArea.append("g")
		.attr("class", "y-axis axis")
		.call(yAxis);

	// Initialize shape function specifying keys
	var stack = d3.stack()
		.keys(dataCategories);

	// Call shape function on the dataset
	var stackedValues = stack(datasetConcentration);
	//console.log(stackedValues);

	// Stacked area layout
	var area = d3.area()
		.curve(d3.curveCardinal)
		.x(function(d)  { return x(d.data.Year); })
		.y0(function(d) { return y(d[0]); })
		.y1(function(d) { return y(d[1]); });


	// Tooltip placeholder
	var tooltip = svgArea.append("text")
		.attr("class", "focus")
		.attr("x", 50)
		.attr("y", 0)
		.attr("font-size", "35px")
		.attr("dy", ".35em");


	// Draw layers
	var categories = svgArea.selectAll(".area")
		.data(stackedValues);

	categories.enter().append("path")
		.attr("class", "area")
		.merge(categories)
		.style("fill", function(d,i) {
			return colors[i];
		})
		.style("stroke", "black")
		.style("stroke-width", 0.25)
		.attr("d", function(d) {
			return area(d);
		})
		.style("opacity", 1)
		// Update tooltip text
		.on("mouseover", function(d,i) {
			tooltip.text(dataCategories[i]);
			d3.select(this).style("opacity", 0.3);
		})
		.on("mouseout", function(d) {
			tooltip.text("");
			d3.select(this).style("opacity", 1);
		});

	categories.exit().remove();

	svgArea.append("text")
		.attr("class", "axis-title")
		.attr("x", width2 / 2 + margin.left - 10)
		.attr("y",  height2 + 50)
		.style("text-anchor", "end")
		.text("Year Awarded");

	svgArea.append("text")
		.attr("x", width2 - 390)
		.attr("y", -width2 + 10)
		.attr("transform", "rotate(90)")
		.attr("dy", "-.1em")
		.style("text-anchor", "start")
		.text("SEAS")
		.attr("font-size", "20px")
		.attr("fill", "#ff0000");

});
