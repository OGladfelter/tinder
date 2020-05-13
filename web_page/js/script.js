// set the dimensions and margins of the graph
if (screen.width < 600){
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = window.innerWidth - margin.left - margin.right,
    height = (window.innerHeight / 2.5) - margin.top - margin.bottom,
    fontSize = "10px";
}
else{
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = (window.innerWidth / 2) - margin.left - margin.right,
    height = (window.innerHeight / 2.5) - margin.top - margin.bottom,
    fontSize = "16px";
}
var animDuration = 800;

function makeSankey(divID, dataSource, formatter, label=""){
    var formatNumber = d3.format("," + formatter),
        format = function(d) {
        return formatNumber(d);
        },
        color = d3.scaleOrdinal(d3.schemeCategory20);

    var svg = d3.select(divID).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("width", width * 2)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var links = svg.append("g"),
        nodes = svg.append("g");

    var sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(40)
        .size([width, height])
        .align('left');

    var path = sankey.link();

    d3.json(dataSource, function(energy) {
        sankey
        .nodes(energy.nodes)
        .links(energy.links)
        .layout(32);

        d3Digest(divID);
    });

    function d3Digest(divID) {

        var link = links.selectAll(".link")
        .data(sankey.links());

        var newLink = link.enter().append("path")
            .attr("class", "link")
            .style("stroke-width", function (d) {
            return Math.max(1, d.dy) + 'px';
            });

        newLink.append("title")
        .text(function (d) {
            return d.source.name + " → " + d.target.name + "\n" + format(d.value) + label;
        });

        link = newLink.merge(link);

        link.transition().duration(animDuration)
        .attr("d", path)
        .style("stroke-width", function (d) {
            return Math.max(1, d.dy) + 'px';
        });

        var node = nodes.selectAll(".node")
        .data(sankey.nodes());

        var newNode = node.enter().append("g")
        .attr("class", "node");

        newNode.attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
        });

        node.transition().duration(animDuration)
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        node = newNode.merge(node);

        newNode.append('rect');
        newNode.append('text');

        newNode.select("rect")
        .attr("width", sankey.nodeWidth())
        .attr("height", function (d) {return d.dy;})
        .style("fill", function(d) { return d.color;})
        .style("stroke", "black")
        .append("title")
            .text(function (d) {
            return d.name + "\n" + format(d.value) + label;
            })

        node.select("rect")
        .transition().duration(animDuration)
            .attr("height", function (d) {
            return d.dy;
            });

        newNode.select("text")
        .attr("dy", ".35em")
        .attr("transform", null)
        .attr("y", function (d) {
            return d.dy / 2;
        });

        if (screen.width < 600){
            node.select("text")
            .attr("font-size", fontSize)
            .text(function (d) {
                if (d.name == "Profiles"){
                    return "Swipes";
                }
                else if (d.name == "Swipe Right"){
                    return "Right";
                }
                else if (d.name == "Swipe Left"){
                    return "Left";
                }
                else{
                    return d.name;
                }
            })
            .attr("x", sankey.nodeWidth() / 2)
            .attr("text-anchor", "middle")
            .style("fill", function(d){
                if ((divID == "#chart3" || divID == "#chart4") & (d.name == "Profiles" || d.name == "Swipe Right")){
                    return "white";
                }
                else{
                    return "black";
                }
            });

            node.select('text')
            .attr("y", function (d) {
                return d.dy / 2;
            })
            .filter(function (d) {
                return d.x > width / 2;
            })
            .attr("y", function (d) {
                return -5;
            });
            
        }
        else{         
            node.select("text")
            .attr("font-size", fontSize)
            .text(function (d) {
                return d.name;
            })
            .attr("x", -6)
            .attr("text-anchor", "end")
            .filter(function (d) {
                return d.x < width / 2;
            })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

            node.select('text')
            .attr("y", function (d) {
                return d.dy / 2;
            });
        }
    }

}

makeSankey("#chart", "data/katie.json", ".0f", " profiles");
makeSankey("#chart2", "data/friends.json", ".1f", percent="%");
makeSankey("#chart3", "data/men.json", ".1f", percent = "%");
makeSankey("#chart4", "data/women.json", ".1f", percent = "%");

var footnote1 = document.getElementById("footnote1");
footnote1.onclick = function() {
    currentStyle = document.getElementById("footnote1Text").style.display;
    document.getElementById("footnote1Text").style.display = (currentStyle === 'block') ? 'none' : 'block';

    currentText = footnote1.innerHTML;
    footnote1.innerHTML = (currentText === 'x') ? '1' : 'x';
};
document.getElementById("footnote1Text").onclick = function() {
    this.style.display = 'none';
    document.getElementById("footnote1").innerHTML = "1";
};

var footnote2 = document.getElementById("footnote2");
footnote2.onclick = function() {
    currentStyle = document.getElementById("footnote2Text").style.display;
    document.getElementById("footnote2Text").style.display = (currentStyle === 'block') ? 'none' : 'block';

    currentText = footnote2.innerHTML;
    footnote2.innerHTML = (currentText === 'x') ? '2' : 'x';
};
document.getElementById("footnote2Text").onclick = function() {
    this.style.display = 'none';
    document.getElementById("footnote2").innerHTML = "2";
};

var footnote3 = document.getElementById("footnote3");
footnote3.onclick = function() {
    currentStyle = document.getElementById("footnote3Text").style.display;
    document.getElementById("footnote3Text").style.display = (currentStyle === 'block') ? 'none' : 'block';

    currentText = footnote3.innerHTML;
    footnote3.innerHTML = (currentText === 'x') ? '3' : 'x';
};
document.getElementById("footnote3Text").onclick = function() {
    this.style.display = 'none';
    document.getElementById("footnote3").innerHTML = "3";
};

var footnote4 = document.getElementById("footnote4");
footnote4.onclick = function() {
    currentStyle = document.getElementById("footnote4Text").style.display;
    document.getElementById("footnote4Text").style.display = (currentStyle === 'block') ? 'none' : 'block';

    currentText = footnote4.innerHTML;
    footnote4.innerHTML = (currentText === 'x') ? '4' : 'x';
};
document.getElementById("footnote4Text").onclick = function() {
    this.style.display = 'none';
    document.getElementById("footnote4").innerHTML = "4";
};