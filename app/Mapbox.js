import mapbox from 'mapbox-gl';
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

        // disable map zoom when using scroll
        //map.scrollZoom.disable();

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
       var dots = svg.selectAll('circle')
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


            map.on('move', function(e){
                //var zoom = map.getZoom(e)
                var p1 = [18.082, 59.319];
                var p2 = [18.082 + 0.0086736, 59.319];
                var a = map.project(p1);
                var b = map.project(p2);
                var radius = (b.x - a.x);

                dots.attr('r', radius)
                    .attr('cx', function(d){
                        return map.project(d.LatLng).x
                    })
                    .attr('cy', function(d){
                        return map.project(d.LatLng).y
                    })
            })

    }
}
export default Mapbox;








                            /*https://codepen.io/parry-drew/pen/xVBEvq
                            http://codepen.io/alandunning/pen/aOwVON
                            https://bl.ocks.org/enjalot/1ed5d9795b82f846759f89029b0b8ff3*/
