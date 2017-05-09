import mapbox from 'mapbox-gl';
import Cluster from './Kmeans';
import TwitterPreview from './TwitterPreview.js'
import BoxComponent from './BoxComponent';

var d3 = require('d3');
var json = require('d3-request');

var map;
var cluster;
var clusterData;
var theData;
let tPreview;
let box;
var div;

class Mapbox {
    constructor(){
        this.init();
    }
    init(){
        //set up a Mapbox
        mapbox.accessToken = 'pk.eyJ1Ijoia2FqZW5mZiIsImEiOiJjajE2amM4aHQwMDJkMnFwcGFhbWwxZGUyIn0.saNCAMrUPdtt1iH_nRdctg';
        map = new mapbox.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v9',
            center: [18.082, 59.319], //default value STO
            zoom: 10
        });
        //create clusters
        cluster = new Cluster();
        //map.scrollZoom.disable(); // disable map zoom when using scroll

        //Set up d3
        var container = map.getCanvasContainer();
        this.svg = d3.select(container).append("svg")
                            .attr('width', 960)
                            .attr('height', 500)


        div = d3.select(container).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        tPreview = new TwitterPreview();
        box = new BoxComponent();
    }

    //Center map based on search result
    centerMap(coords){
        map.flyTo({
            center: [coords[0], coords[1]],
            zoom: 12,
            bearing: 0
          });
          this.addData();
    }

    addData(){
        //load data
        d3.json('new_data.json', (error, data) => {
            if(error) console.error();

            //cluster data
            clusterData = cluster.getData(3, data);
            let circleObjects = cluster. getCircleObjects(clusterData);

            //convert each lat and lng to mapbox.LngLat objects
            circleObjects.forEach(function(d){
                d.LngLat = new mapbox.LngLat(d.lng, d.lat);
            })
            this.draw(circleObjects);
            box.updateTwitterInfo(clusterData)
        });

    }

    draw(d){
        this.svg.selectAll('circle').remove();
        //setup and append our svg with a circle tag and a class of dot
       var dots = this.svg.selectAll('circle')
                                .data(d)
                                .enter()
                                .append("circle")
                                .attr('class', 'dot')
                                .attr('cx', function(d){
                                    return  map.project(d.LngLat).x;
                                })
                                .attr('cy', function(d){
                                    return  map.project(d.LngLat).y;
                                })
                                .on('click', function(d, i){
                                    tPreview.setData(clusterData[i], i);
                                    //box.updateTwitter(clusterData, i)
                                })
                                .attr('r', 20)
                                .style("fill", "red")
                                .on('mouseover', function(d){
                                    div.transition()
                                         .duration(200)
                                         .style("opacity", .9)

                                     div.html("formatTime(d.date)" +"<br/>" + "d.close")
                                      .style("left", map.project(d.LngLat).x+ "px")
                                      .style("top", (map.project(d.LngLat).y + 28) + "px")


                                })
                                .on("mouseout", function(d) {
                                   div.transition()
                                     .duration(500)
                                     .style("opacity", 0);
                                   });
                                //.style('z-index', 1)

            //adjust all d3-elements when zoomed
            map.on('move', function(e) {
                var zoom = map.getZoom(e)
                var p1 = [18.082, 59.319];
                var p2 = [18.082 + 0.0086736, 59.319];
                var a = map.project(p1);
                var b = map.project(p2);
                var radius = (b.x - a.x)

                // ju större dest zoom desto mindre radie
                dots.attr('r', function(d) {
                        var h = d.rad*4;
                        if(h < zoom || h < 10)
                            return 10;
                        else
                            return h-zoom;
                })
                    .attr('cx', function(d){
                        return map.project(d.LngLat).x
                    })
                    .attr('cy', function(d){
                        return map.project(d.LngLat).y
                    })
            })
    }

}
export default Mapbox;
