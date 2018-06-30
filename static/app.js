var url ="/crash";

function buildPlot() {
  Plotly.d3.json(url, function(error, response) {

    console.log('logging response');

    console.log(response);

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: "DC Crashes in 2016",
      x: response.map(data => data.hour),
      y: response.map(data => data.crashes),
      fill: "tonexty",
      line: {
        color: "skyblue",
        dash: "dot",
        shape: "spline",

      }
    };

    var data = [trace1];

    var layout = {

      xaxis: {
        type: "linear",
        title: "Time of Day",
        nticks: "24",
        showgrid: "True",
        tickvals: ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        ticktext: ['', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM','2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM']

      },
      yaxis: {
        autorange: true,
        type: "linear",
        title: "Number of Crashes"
      }};

    Plotly.newPlot("plot", data, layout);
  });
}

buildPlot();
