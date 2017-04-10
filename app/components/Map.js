var d3 = require('d3');
var topojson = require('topojson');
var d3Request = require("d3-request");
import $ from 'jquery'

let g = 0,
    path = 0,
    zoom = 0,
    active = 0;

const margin = {top: 20, right: 20, bottom: 20, left: 20 };
const height = 700 - margin.top - margin.bottom;
const width = 700 - margin.left - margin.right;

class Map {
    constructor(){
        // set-up unit projection and path
        this.max = 0;
        this.init();
    }
    init() {
        active = d3.select(null);

        zoom = d3.zoom()
                                .scaleExtent([1/2, 16])
                                .on('zoom', this.zoomed)

        //setup svg
        var svg = d3.select("#map")
                                .append('svg')
                                .attr("width", width)
                                .attr("height", height)
                                .call(zoom)

        g = svg.append("g");

        //set up map
        var projection = d3.geoMercator()
                .scale(1000)
                .translate([200,1700])
                //.center([50,50]) //40, 65



        path = d3.geoPath()
            	.projection(projection);

        d3.json('sto.json', (error, data) => {

            if (error)
                console.log(error);

                //var countries= data.features;
                //var countries = topojson.feature(data, data.objects.sverige).features
            var countries = topojson.feature(data, data.objects.europe).features
            this.draw(countries);
        });

        //background
        g.append('rect')
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'none')
            .on('click', this.reset);

    }

    //TODO: fixa så att funktionen kallas på när ny data har hämtats
    /*addData(){

    }*/

    //draw the map
    draw(countries) {
        g.selectAll("path")
            .data(countries)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", path)
            .style('stroke-width', 0.5)
            .style("fill", "lightgray")
            .style("stroke", "white")
            .on("click", this.clicked)

    }
    zoomed(){
        g.style("stroke-width", 1.5 / d3.event.scale + "px");
        g.attr("transform", d3.event.transform);
    }

    clicked(d) {
        if (active.node() === this) return this.reset;
        d3.select(this).style("fill", "green");
        console.log(d.properties.KNNAMN);
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

        var bounds = path.bounds(d),
              dx = bounds[1][0] - bounds[0][0],
              dy = bounds[1][1] - bounds[0][1],
              x = (bounds[0][0] + bounds[1][0]) / 2,
              y = (bounds[0][1] + bounds[1][1]) / 2,
              scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
              translate = [width / 2 - scale * x, height / 2 - scale * y];

          g.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );

        //d3.select(d).classed("active", false);
        //this.active = d3.select(d).classed("active", true);
    }
    // doesn't work
    reset(){
        console.log('i reset');
        svg.transition()
              .duration(750)
              .call(zoom.translate([0, 0]).scale(1).event);
    }
    hello(){
        console.log('hello');
      return `HEJ KARTAN`;
    }
}

export default Map;
