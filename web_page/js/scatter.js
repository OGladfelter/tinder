// set the dimensions and margins of the graph
if (screen.width < 600){
    var margin = {top: 30, right: 30, bottom: 50, left: 50},
    width = window.innerWidth - margin.left - margin.right,
    height = (window.innerHeight / 2) - margin.top - margin.bottom;
}
else{
    var margin = {top: 30, right: 30, bottom: 50, left: 50},
    width = (window.innerWidth / 2) - margin.left - margin.right,
    height = (window.innerHeight / 2) - margin.top - margin.bottom;
}


var x = d3.scaleLinear()
    .range([10, width-10]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var svg = d3.select("#scatterplot").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/num_Tinder_messages.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.numMessages = +d.numMessages;
    d.days_diff = +d.days_diff;
  });

  x.domain(d3.extent(data, function(d) { return d.days_diff; })).nice();
  y.domain(d3.extent(data, function(d) { return d.numMessages; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis.ticks(5));

    // Tool tip 
    var tooltip = d3.select("#scatterplot")
        .append("div")
        .style('visibility', 'hidden')
        .attr('class', 'tooltip');
  
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 4)
      .attr("cx", function(d) { return x(d.days_diff); })
      .attr("cy", function(d) { return y(d.numMessages); })
      .on("mouseover", function(d){
        return tooltip
        .style("visibility", "visible")
        .html("This match received <br> <b style='color: #FE3C72;'>" + d.numMessages + "</b> messages in <b style='color: #FE3C72;'>" + Math.round(d.days_diff) + "</b> days")
        .transition().duration(500)
         .style("left", event.pageX + 5 + "px")
         .style("top", event.pageY + 5 + "px")
    });

    // text label for the x axis
    svg.append("text")             
    .attr("transform",
        "translate(" + (width/2) + " ," + 
                        (height + margin.bottom - 10) + ")")
    .style("text-anchor", "middle")
    .text("Days Passed Between First And Last Messages");

    // text label for the y axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Messages Sent");     

    svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .text("1,200 Tinder Conversations");

});
