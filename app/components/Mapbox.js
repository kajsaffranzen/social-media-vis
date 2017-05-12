import mapbox from 'mapbox-gl';
import Cluster from './Kmeans';
import TwitterPreview from './TwitterPreview.js'
import BoxComponent from './BoxComponent';
import _ from 'underscore';

var d3 = require('d3');
var json = require('d3-request');

var map;
var cluster;
//var clusterData;
var theData;
let tPreview;
let box;
var div;
var kaj;
var brush;
var container;
var isBrushed;

class Mapbox {
    constructor(){
        isBrushed = false;
        this.init();
    }
    init(){
        //set up a Mapbox
        mapbox.accessToken = 'pk.eyJ1Ijoia2FqZW5mZiIsImEiOiJjajE2amM4aHQwMDJkMnFwcGFhbWwxZGUyIn0.saNCAMrUPdtt1iH_nRdctg';
        map = new mapbox.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/light-v9',
            center: [18.082, 59.319], //default value STO
            zoom: 3
        });
        //map.scrollZoom.disable(); // disable map zoom when using scroll

        //Set up d3
        container = map.getCanvasContainer();

        this.svg = d3.select(container).append("svg")
                            .attr('width', 960)
                            .attr('height', 500)


        div = d3.select(container).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    brush = d3.brush().on("end", this.brushMap);

    this.svg.append("g")
                .attr("class", "brush")
                .call(brush);

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

    }

    addData(data){
        //load data
        /*d3.json('test.json', (error, data) => {
            if(error) console.error();*/

            //split data points with coordinates from those without
            let dataWithCoord = [];
            let dataWithoutCoord = [];
            for(let value of data){
                if(value.lng === 0)
                    dataWithoutCoord.push(value)
                else
                    dataWithCoord.push(value);
            }

            data = this.clusterData(data);
            data.forEach(function(d){
                d.LngLat = new mapbox.LngLat(d.lng, d.lat);
            })

            kaj = data;
            this.draw(kaj);
            box.updateTwitterInfo(dataWithCoord, dataWithoutCoord)
            tPreview.resetFilters();
    }
    clusterData(data){
        let newObj = [];
        //group data based on lat-coord
        for(var i = 0; i < data.length; i++){
            //check if the coord already ha an array
            if(!isContaining(data[i]))
                newObj.push(checkDub(data[i], i));
        }
        function isContaining(d){
            for(var i = 0; i < newObj.length; i++){
                if(newObj[i].lat === d.lat && newObj[i].lng === d.lng)
                    return true;
            }
            return false;
        }
        function checkDub(d, index){
            let a = [];
            let b = {
                lat: d.lat,
                lng: d.lng,
                tweets: ''
            };
            a.push(d);
            for(var i = index+1; i < data.length; i++){
                if(d.lng == data[i].lng && d.lat == data[i].lat){
                    console.log('vi har en match');
                    a.push(data[i])
                }
            }
            b.tweets = a;
            return b;
        }

        return newObj;
    }


    draw(d){
        /*isBrushed = true;
        this.resetBrush();*/
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
                               .on('click', (d, i) => {
                                   this.selectDot(d);
                                })
                                .attr('r', (d) => {
                                    let rad = d.tweets.length;
                                    return rad*2;
                                })
                                //.style("fill", "red")
                                .on('mouseover', (d) =>{
                                    div.transition()
                                         .duration(200)
                                         .style("opacity", .9)

                                     div.html(d.tweets.length)
                                      .style("left", (map.project(d.LngLat).x+ 40)+ "px")
                                      .style("top", (map.project(d.LngLat).y) + "px")

                                })
                                .on("mouseout", function(d) {
                                   div.transition()
                                     .duration(500)
                                     .style("opacity", 0);
                                 });


            //adjust all d3-elements when zoomed
            map.on('move', (e) => {
                var zoom = map.getZoom(e)
                var p1 = [18.082, 59.319];
                var p2 = [18.082 + 0.0086736, 59.319];
                var a = map.project(p1);
                var b = map.project(p2);
                var radius = (b.x - a.x)

                dots.attr('cx', function(d){
                        return map.project(d.LngLat).x
                    })
                    .attr('cy', function(d){
                        return map.project(d.LngLat).y
                    })

            })
            map.on('moveend', (e) => {
                this.resetBrush();
                var bounds = map.getBounds();
                var se= bounds.getSouthEast().wrap().toArray();
                var nw = bounds.getNorthWest().wrap().toArray();

                tPreview.showDefaultView(se, nw, kaj);
            })
    }

    brushMap() {
        var s = d3.event.selection;

        if(!s ){
            console.log('inget är markerat');
            isBrushed = false;
            d3.selectAll('circle')
                .style('fill', (d) => {
                        return '#000000';
                })
                return;
        } else {
            isBrushed = true;
            var nw = map.unproject(s[0]);
            var se = map.unproject(s[1]);
            var choosen = [];

            d3.selectAll('circle')
                .style('fill', (d, i) => {
                    if(d.lat <= nw.lat && d.lng >= nw.lng && d.lat >= se.lat && d.lng <= se.lng){
                        choosen.push(d);
                        return '#044C29';
                    }
                    else
                        return '#000000';
                })
            tPreview.setData(choosen);
        }
    }
    selectDot(data){
        d3.selectAll('circle')
            .style('fill', (d, i) => {
                if(d.lat === data.lat && d.lng === data.lng){
                    return '#044C29';
                }
                else
                    return '#000000';
            })
        tPreview.showClusterOfTweets(data);
    }
    resetBrush(){
        if(isBrushed === true)
            this.svg.call(brush, null);
    }
}
export default Mapbox;
