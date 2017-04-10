import mapbox from 'mapbox-gl';
//import d3 from 'd3';
var d3 = require('d3');

class Mapbox {
    constructor(){
        console.log('i constructor');
        this.init();
    }
    init(){
        //set up a Mapbox
        mapbox.accessToken = 'pk.eyJ1Ijoia2FqZW5mZiIsImEiOiJjajE2amM4aHQwMDJkMnFwcGFhbWwxZGUyIn0.saNCAMrUPdtt1iH_nRdctg';
        var map = new mapbox.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v9',
            center: [18.082, 59.319],
            zoom: 10
        });

        // D3 will insert a svg into the map container
        var container = map.getCanvasContainer();
        var svg = d3.select(container).append("svg")
                            .attr('width', 960)
                            .attr('height', 500)

        var center = map.getCenter();
        var bbox = document.body.getBoundingClientRect();


        var projection = d3.geoMercator()
                .center([center.lng, center.lat])
                .translate([bbox.width/2, bbox.height/2])
                .scale(300)
            //    .translate([200,1700])

            var path = d3.geoPath()
                    .projection(projection);

        var transform = d3.geoTransform({point: projectionPoint});

        var data = [
            {"coords": [18.082, 59.319]},
            {"coords": [18.082, 59.319]}
        ];

        //setup and append our svg with a circle tag and a class of dot
        svg.selectAll('circle')
            .data(data)
            .enter()
          .append("circle")
          .attr('cx', function(d){
              return d.coords[0]
          })
          .attr('cy', function(d){
              return d.coords[1]
          })
          .attr('r', 20)
            .style("fill", "red")
            .style('z-index', 1)

        function projectionPoint(long, lat){
            var point = map.project(new mapboxgl.LngLat(lon, lat));
            console.log('point: ' + point);
            return point
//            this.stream.point(point.x, point.y);
        }
    }
}
export default Mapbox;








                            /*https://codepen.io/parry-drew/pen/xVBEvq
                            http://codepen.io/alandunning/pen/aOwVON
                            https://bl.ocks.org/enjalot/1ed5d9795b82f846759f89029b0b8ff3*/
