
// Create SVG drawing area
var margin = {top: 40, right: 40, bottom: 60, left: 60};

var width2 = 700 - margin.left - margin.right,
	height2 = 500 - margin.top - margin.bottom;

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

var dataCategories = ["Classics", "Comparative Literature",
	"Comparative Study of Religion", "East Asian Studies", "English",
	"Folklore and Mythology", "Germanic Languages and Literatures", "History and Literature",
	"History of Art and Architecture", "Linguistics", "Music",
	"Near Eastern Languages and Civilizations", "Philosophy", "Romance Languages and Literatures",
	"Sanskrit and Indian Studies", "Slavic Languages and Literatures", "South Asian Studies",
	"Visual and Environmental Studies", "Applied Mathematics", "Biomedical Engineering",
	"Computer Science", "Electrical Engineering", "Engineering Sciences",
	"Mechanical Engineering", "Astrophysics", "Biochemical Sciences",
	"Chemical and Physical Biology", "Chemistry", "Chemistry and Physics",
	"Earth and Planetary Sciences", "Environmental Science and Public Policy", "Human Developmental and Regenerative Biology",
	"Human Evolutionary Biology", "Integrative Biology", "Mathematics",
	"Molecular and Cellular Biology", "Neurobiology", "Organismic and Evolutionary Biology",
	"Physics", "Statistics", "African and African American Studies",
	"Anthropology", "Economics", "Government",
	"History", "History and Science", "Psychology",
	"Social Studies", "Sociology", "Studies of Women, Gender, and Sexuality",
	"Special Concentration"];

var colorScale = d3.scaleOrdinal(d3.schemeReds[30])
	.domain(dataCategories);

// Try this!
// var colors = dataCategories.map(function (d, i) {
// 	return d3.interpolateReds(i / dataCategories.length);
// });
//
// var colorScale = d3.scaleOrdinal()
// 	.domain(dataCategories)
// 	.range(colors);

var parseTime = d3.timeParse("%Y");

d3.select("#combo-box").on("change", updateColor);


d3.csv("data/ConcentrationData.csv", function(data) {

	datasetConcentration = data;
	console.log("hello");
	console.log(datasetConcentration);

	datasetConcentration.forEach(function(d){

		// Parse data
		d.Year = parseTime(d.Year);
		d["Classics"] = +d["Classics"];
		d["Comparative Literature"] = +d["Comparative Literature"];
		d["Comparative Study of Religion"] = +d["Comparative Study of Religion"];
		d["East Asian Studies"] = +d["East Asian Studies"];
		d["English"] = +d["English"];
		d["Folklore and Mythology"] = +d["Folklore and Mythology"];
		d["Germanic Languages and Literatures"] = +d["Germanic Languages and Literatures"];
		d["History and Literature"] = +d["History and Literature"];
		d["History of Art and Architecture"] = +d["History of Art and Architecture"];
		d["Linguistics"] = +d["Linguistics"];
		d["Music"] = +d["Music"];
		d["Near Eastern Languages and Civilizations"] = +d["Near Eastern Languages and Civilizations"];
		d["Philosophy"] = +d["Philosophy"];
		d["Romance Languages and Literatures"] = +d["Romance Languages and Literatures"];
		d["Sanskrit and Indian Studies"] = +d["Sanskrit and Indian Studies"];
		d["Slavic Languages and Literatures"] = +d["Slavic Languages and Literatures"];
		d["South Asian Studies"] = +d["South Asian Studies"];
		d["Visual and Environmental Studies"] = +d["Visual and Environmental Studies"];
		d["Applied Mathematics"] = +d["Applied Mathematics"];
		d["Biomedical Engineering"] = +d["Biomedical Engineering"];
		d["Computer Science"] = +d["Computer Science"];
		d["Electrical Engineering"] = +d["Electrical Engineering"];
		d["Engineering Sciences"] = +d["Engineering Sciences"];
		d["Mechanical Engineering"] = +d["Mechanical Engineering"];
		d["Astrophysics"] = +d["Astrophysics"];
		d["Biochemical Sciences"] = +d["Biochemical Sciences"];
		d["Chemical and Physical Biology"] = +d["Chemical and Physical Biology"];
		d["Chemistry"] = +d["Chemistry"];
		d["Chemistry and Physics"] = +d["Chemistry and Physics"];
		d["Earth and Planetary Sciences"] = +d["Earth and Planetary Sciences"];
		d["Environmental Science and Public Policy"] = +d["Environmental Science and Public Policy"];
		d["Human Developmental and Regenerative Biology"] = +d["Human Developmental and Regenerative Biology"];
		d["Human Evolutionary Biology"] = +d["Human Evolutionary Biology"];
		d["Integrative Biology"] = +d["Integrative Biology"];
		d["Mathematics"] = +d["Mathematics"];
		d["Molecular and Cellular Biology"] = +d["Molecular and Cellular Biology"];
		d["Neurobiology"] = +d["Neurobiology"];
		d["Organismic and Evolutionary Biology"] = +d["Organismic and Evolutionary Biology"];
		d["Physics"] = +d["Physics"];
		d["Statistics"] = +d["Statistics"];
		d["African and African American Studies"] = +d["African and African American Studies"];
		d["Anthropology"] = +d["Anthropology"];
		d["Economics"] = +d["Economics"];
		d["Government"] = +d["Government"];
		d["History"] = +d["History"];
		d["History and Science"] = +d["History and Science"];
		d["Psychology"] = +d["Psychology"];
		d["Social Studies"] = +d["Social Studies"];
		d["Sociology"] = +d["Sociology"];
		d["Studies of Women, Gender, and Sexuality"] = +d["Studies of Women, Gender, and Sexuality"];
		d["Special Concentration"] = +d["Special Concentration"];

	});

	console.log(datasetConcentration);

	// Scales and axes
	var x = d3.scaleTime()
		.range([0, width2])
		.domain(d3.extent(datasetConcentration, function(d) { return d.Year; }));

	var y = d3.scaleLinear()
		.range([height2, 0])
		.domain([0, 2000]);

	var xAxis = d3.axisBottom()
		.ticks(5)
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
		.text("Degrees Awarded");

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
	console.log(stackedValues);

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
		.attr("dy", ".35em");


	// Draw layers
	var categories = svgArea.selectAll(".area")
		.data(stackedValues);

	categories.enter().append("path")
		.attr("class", "area")
		.merge(categories)
		.style("fill", function(d,i) {
			return colorScale(dataCategories[i]);
		})
		.attr("d", function(d) {
			return area(d);
		})
		// Update tooltip text
		.on("mouseover", function(d,i) {
			tooltip.text(dataCategories[i]);
		})
		.on("mouseout", function(d) {
			tooltip.text("");
		})
		.on("click", function(d){var nextColor = this.style.fill == "red" ? "white" : "red";
			d3.select(this).style("fill", nextColor);
		});

	categories.exit().remove();

	svgArea.append("text")
		.attr("class", "axis-title")
		.attr("x", width2)
		.attr("y",  height2 - 5)
		.style("text-anchor", "end")
		.text("Year Awarded");

});


function updateColor() {
	selected_data = d3.select("#combo-box").property("value");
	console.log(selected_data);

}