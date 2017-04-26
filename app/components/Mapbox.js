import mapbox from 'mapbox-gl';
import Cluster from './Kmeans';
var d3 = require('d3');
var json = require('d3-request');

var map;
var cluster;

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
        d3.json('test.json', (error, data) => {
            if(error) console.error();
            //cluster data
            var clusterData = cluster.getData(3, data);

            //convert each lat and lng to mapbox.LngLat objects
            clusterData.forEach(function(d){
                d.LngLat = new mapbox.LngLat(d.lng, d.lat);
            })
            this.draw(data, clusterData);
        });

    }
    draw(data, d){
        this.svg.selectAll('circle').remove();
        //setup and append our svg with a circle tag and a class of dot
       var dots = this.svg.selectAll('circle')
                                .data(d)
                                .enter()
                                .append("circle")
                                .attr('cx', function(d){
                                    return  map.project(d.LngLat).x;
                                })
                                .attr('cy', function(d){
                                    return  map.project(d.LngLat).y;
                                })
                                .style("fill", "red")
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
                dots.attr('r', function(d){
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
