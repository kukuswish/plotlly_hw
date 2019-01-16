function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    panel.html('');

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var u = "/metadata/"+sample
    d3.json(u).then(function(data) {
        content = '<div><h3>Sample '+sample+"</h3></div>";
        content += '<div><label>Age : </label> '+data.AGE+'</div>';
        content += '<div><label>BBTYPE : </label> '+data.BBTYPE+'</div>';
        content += '<div><label>ETHNICITY : </label> '+data.ETHNICITY+'</div>';
        content += '<div><label>GENDER : </label> '+data.GENDER+'</div>';
        content += '<div><label>LOCATION : </label> '+data.LOCATION+'</div>';
        content += '<div><label>WFREQ : </label> '+data.WFREQ+'</div>';

        panel.html(content);
    }); 
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  var u = "/samples/"+sample;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(u).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      type: "scatter",
      mode: "markers",
      x: data.otu_ids,
      y: data.sample_values,
      hovertext: data.otu_labels,
      marker: {
        colorscale: 'Earth',
        size: data.sample_values,
        sizemode: 'diameter'
      }
    };

    var scatterData = [trace1];
    var layout = {
      xaxis: {
        title: 'OTU IDS'
      },
      showlegend: false,
      automargin: true,
      height: 500
    };
    
    Plotly.newPlot('bubble', scatterData, layout, {responsive: true});
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
