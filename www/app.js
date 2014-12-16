//
//
// app.js - Main JavaScript file of the application
//

// Management of module dependencies by the lib require.js
require([
	"scales",
	"chords",
	"guitarConstants",
	"songs"
],
	function() {
		// Function called only when all dependencies have been loaded
		main();
	}
);


function main() {

	///////////////////////
	// GLOBAL PARAMETERS //
	///////////////////////

	var palettes = [
		[ // Ocean Five
			"#00A0B0",
			"#6A4A3C",
			"#CC333F",
			"#EB6841",
			"#EDC951"
		],
		[ // Giant Goldfish
			"#69D2E7",
			"#A7DBD8",
			"#E0E4CC",
			"#F38630",
			"#FA6900",
			
		],
		[ // let them eat cake
			"#774F38",
			"#E08E79",
			"#F1D4AF",
			"#ECE5CE",
			"#C5E0DC",
		]
	];

	var CURVECOLOR = "#00A0B0";
	var NOTESCOLOR = "#CC333F";
	var NOTESSIZE = "9";
	var LINESWIDTH = "2";

	var linesAlpha = 0.1;


	//////////
	// DATA //
	//////////

	// var songNotes = songs.fortheloveofgod;
	var songNotes = songs.minorswing;

	var notesMatrix = [];
	var notesCount = { "C": 0,"Db": 0,"D": 0,"Eb": 0,"E": 0,"F": 0,"Gb": 0,"G": 0,"Ab": 0,"A": 0,"Bb": 0,"B": 0 };
	for(var i=0; i<nfrets; i++) {
		notesMatrix[i] = new Array(nstrings);
		for(var j=0; j<nstrings; j++) {
	        notesMatrix[i][j] = 0;
	    }
	}

	function printFretBoard() {
		for(var i=0; i<nfrets; i++) {
			console.log(notesMatrix[i].join("\t"));
		}
	}

	// Counts number of notes
	songNotes.forEach( function(i) {
		var x = i.fret-1;
		var y = i.string-1;

		var isFretInBounds = x >= 0 && x < nfrets-1;
		var isStringInBounds = y >= 0 && y < nstrings-1;
		
		// console.assert(isFretInBounds, "Fret index out of bounds");
		// console.assert(isStringInBounds, "String index out of bounds");
		
		if (isFretInBounds && isStringInBounds) {
			var note = notesMap[y][x];
			
			// Add count in the fretboard mapping
			notesMatrix[x][y]++;

			// Add count in the count of notes
			notesCount[note]++;
		}
	});
	var maxNotesPerPosition = d3.max(notesMatrix, function(d) { return d3.max(d); });


	//////////////////////
	// Initializations  //
	//////////////////////


	// Insert SVG element
	var svg = d3.select("body")
			.append("svg")
		.attr("width", 1857) // dimensions of the fret: image
		.attr("height", 118);

	svg.append("svg:image")
		.attr('id',"image")
		.attr('width', "100%")
		.attr('height', "100%")
		.attr("xlink:href","img/neck.jpg");
		// .attr('opacity', '0');


	/////////////////////////////
	// Control panel settings  //
	/////////////////////////////

	function updateAttrConfig(controlName, elemName, newValue) {
		d3.select("#"+controlName).property("value", newValue);
		svg.selectAll("circle").attr(elemName, newValue);
	}

	function updateStyleConfig(controlName, elemName, newValue) {
		d3.select("#"+controlName).property("value", newValue);
		svg.selectAll(elemName).style("opacity", newValue/100);
	}

	d3.select("#data_radius").on("input", function() {
		updateAttrConfig("data_radius","r",+this.value);
	});

	d3.select("#linesAlpha").on("input", function() {
		updateStyleConfig("linesAlpha", "path", this.value);
	});

	// FIX ME!
	d3.select("#showImage").on("input", function() {
		console.log(this.value);
		// svg.selectAll(image).attr("hidden", this.value);
	});

	updateAttrConfig("data_radius","r",NOTESSIZE);
	updateStyleConfig("linesAlpha", "path", linesAlpha*100);



	////////////////////////////////////////////////////////////////////////////


	//////////////
	// PLOTTING //
	//////////////


	// Lines
	svg.selectAll(".line")
		.data(d3.pairs(songNotes))
		.enter()
		.append("path")
		// Crazy function that creates a cool slightly bended curve
		.attr("d", function(d) {
			if ( d[0].fret-1 >= 0 && d[0].string-1 >= 0 && d[1].fret-1 >= 0 && d[1].string-1 >= 0 ) {
				var sx = fretCoords[d[0].fret-1], sy = stringCoords[d[0].string-1],
				tx = fretCoords[d[1].fret-1], ty = stringCoords[d[1].string-1],
				dx = tx - sx, dy = ty - sy,
				dr = 2 * Math.sqrt(dx * dx + dy * dy);
				return "M" + sx + "," + sy + "A" + dr + "," + dr + " 0 0,1 " + tx + "," + ty;
			}
			else {
				return "";
			}

		  })
		.style("stroke", CURVECOLOR)
		.style("fill", "none")
		.style("stroke-width", LINESWIDTH)
	   	.style("opacity", linesAlpha);

	// Notes
	var scaler = d3.scale.linear()
	    .domain([0, maxNotesPerPosition])
	    .range([0.3, 1]);
	
	// Create a SVG group for each fret ...
	var divs = svg.selectAll("g.fret")
		.data(notesMatrix)
		.enter()
		.append("g");

	// And then of each fret iterate by the strings, creating as well one SVG
	//   group for each one.
	var g = divs.selectAll("g")
		.data(function(d) { return d; })
		.enter()
		.append("g")
			// The transform property will set the right position of the note
			.attr("transform", function(d,i,j) { return "translate(" + fretCoords[j] + "," + stringCoords[i] + ")"; } )
			// The opacity will be given by a scaler that maps the note frequency
			//    to the opacity scale set earlier.
			.attr("opacity", function(d) { return scaler(d); })
			// The following 2 properties are for interactivity
			.on("mouseover", function(d) { 
				d3.select(this)
					.transition()
					.ease("easeOutQuint")
					.style("opacity", 1); 
			})
			.on("mouseout", function(d) {
				d3.select(this)
					.transition()
					.style("opacity", scaler(d) );
			});

		// Adds svg circle
		g.append("circle")
				.attr("r", NOTESSIZE)
				.attr("fill", function(d) { return d===0 ? "grey" : NOTESCOLOR; } );
				// .on("mouseover", function(d) { 
				// 	var node = d3.select(this);
				// 	node.style("stroke", "#E0E4CC"); 
				// 	node.style("stroke-width", "2px"); 
				// })
				// .on("mouseout", function(d) {
				// 	var node = d3.select(this);
				// 	node.style("stroke", "none"); 
				// });

		// Adds svg text
		g.append("text")
				.text(function(d,i,j) { return notesMap[i][j]; })
				// .attr("x", fretCoords[i] )
				// .attr("y", function(d,j) { return stringCoords[j]; })
			    // .attr("opacity", function(d) { return scaler(d); })
			    .style("font-family", "sans-serif")
				.style("font-size", "11px")
				.style("text-anchor", "middle")
				.style("dominant-baseline", "middle")
				.style("pointer-events", "none")
				.style("fill","white");

		// p.exit().remove();
	// }



	////////////////////////////////////////////////////////////////////////////


	////////////////
	// STATISTICS //
	////////////////


	addBarChart(notesCount);

}


// Inserts a Bar Chart SVG component that plots the data given as a dictionary 
//   of the form { key: value, key: value, ... }
function addBarChart(data) {

	var margin = {top: 40, right: 20, bottom: 30, left: 40},
	width = 800 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var chartSvg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x.domain(Object.keys(data));
	y.domain([0, d3.max(Object.keys(data), function(d) { return data[d]; }) ]);

	chartSvg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	chartSvg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Quantity");

	chartSvg.selectAll(".bar")
		.data(Object.keys(data))
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) { return x(d); })
		.attr("width", x.rangeBand())
		.attr("y", function(d) { return y(data[d]); })
		.attr("height", function(d) { return height - y(data[d]); });

}