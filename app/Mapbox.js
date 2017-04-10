import mapbox from 'mapbox-gl';
var L = require('mapbox');
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

        // Append <g> to <svg>
        var g = svg.append("g");

        var data = [
            {"coords": [18.082, 59.319]},
            {"coords": [18.057973, 59.331588]}
        ];

        data.forEach(function(d) {
            d.LatLng = new mapbox.LngLat(d.coords[0], d.coords[1]);
        })


        //setup and append our svg with a circle tag and a class of dot
       svg.selectAll('circle')
            .data(data)
            .enter()
          .append("circle")
          .attr('cx', function(d){
              console.log(d);
             return  map.project(d.LatLng).x;
          })
          .attr('cy', function(d){
            return  map.project(d.LatLng).y;
          })
          .attr('r', 20)
            .style("fill", "red")
            .style('z-index', 1)

    }
}
export default Mapbox;








                            /*https://codepen.io/parry-drew/pen/xVBEvq
                            http://codepen.io/alandunning/pen/aOwVON
                            https://bl.ocks.org/enjalot/1ed5d9795b82f846759f89029b0b8ff3*/
