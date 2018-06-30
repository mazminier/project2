var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenYAxis = "Fatalities per Capita";

// function used for updating y-scale var upon click on axis label
function yScale(policeData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(policeData, d => d[chosenYAxis]) * 0.8,
      d3.max(policeData, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, height]);

  return yLinearScale;

}

// function used for updating yAxis var upon click on axis label
function renderAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenYAxis, circlesGroup) {

  if (chosenYAxis == "") {
    var label = "Fatalities per Capita:";
  }
  else {
    var label = "DUI per Capita:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.State}<br>${label} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.json("/police", function(err, policeData) {
  if (err) throw err;

  // parse data
  policeData.forEach(function(data) {
    data.State = +data.State;
    data.Police = +data.Police;
    data.Fatalities = +data.Fatalities;
    data.DUI = +data.DUI;
  });

  // yLinearScale function above csv import
  var yLinearScale = yScale(policeData, chosenYAxis);

  // Create x scale function
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(policeData, d => d.Police)])
    .range([height, 0]);

  // Create initial axis functions
  var leftAxis = d3.axisLeft(yLinearScale);
  var bottomAxis = d3.axisBottom(xLinearScale);

  // append x axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, ${width})`)
    .call(leftAxis);

  // append y axis
  chartGroup.append("g")
    .call(bottomAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(policeData)
    .enter()
    .append("circle")
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("cx", d => xLinearScale(d.police))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  // Create group for  2 y- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${height / 2}, ${width + 20})`);

  var policeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "Police") // value to grab for event listener
    .classed("inactive", true)
    .text("Law Enforement per Capita");

  // append y axis
  var duiLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("DUI per Capita");

  var fatalityLabel = labelsGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("Fatalities per Capita");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

  // y axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value != chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(policeData, chosenyAxis);

        // updates x axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis == "Fatalities") {
          fatalityLabel
            .classed("active", true)
            .classed("inactive", false);
          duiLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          fatalityLabel
            .classed("active", false)
            .classed("inactive", true);
          duiLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});