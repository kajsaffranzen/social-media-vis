import mapbox from 'mapbox-gl';
import Cluster from './Kmeans';
import TwitterPreview from './TwitterPreview.js'
import BoxComponent from './BoxComponent';
import SearchComponent from './SearchComponent';
import _ from 'underscore';

var d3 = require('d3');
var json = require('d3-request');

var map;
var cluster;
var search;
//var clusterData;
var theData;
let tPreview;
let box;
var div;
var kaj;
var brush;
var container;
var isBrushed;
//var dots;

class Mapbox {
    constructor(){
        isBrushed = false;
        this.tweets = [];
        this.nrOfTweets = 0;
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
        search = new SearchComponent();
    }
    newSearch(){
        isBrushed = false;
        this.tweets = [];
        this.nrOfTweets = 0;
        box.updateNumberOfCoordTweets(this.nrOfTweets);
        box.updateNumberGeoTweets(0);
        console.log('new Search ' + this.tweets.length + '  ' + this.nrOfTweets);
    }
    //Center map based on search result
    centerMap(coords){
        map.flyTo({
            center: [coords[0], coords[1]],
            zoom: 12,
            bearing: 0
          });

    }
    addTopicData(data, topic){
        let str = data.text.toString();
        if(str.toLowerCase().indexOf(topic) >= 0)
            console.log('yes! ', data.topic);
    }
    addStreamData(data){
        this.nrOfTweets++;
        if(data.coords != null){
            data.LngLat = new mapbox.LngLat(data.coords.coordinates[0], data.coords.coordinates[1]);
            this.tweets.push(data)
            this.testDraw(this.tweets)
        }
        else if (data.geo != null){
            data.LngLat = new mapbox.LngLat(data.coords.coordinates[1], data.coords.coordinates[0]);
            this.tweets.push(data)
            this.testDraw(this.tweets)
        } else console.log('finns inga coords');

        box.updateNumberOfCoordTweets(this.nrOfTweets);
    }

    testDraw(data){
        box.updateNumberGeoTweets(data.length);
        this.dots = this.svg.selectAll('circle')
                                 .data(data)
                                 .enter()
                                 .append("circle")
                                 .attr('class', 'dot')
                                 .attr("r", 10)
                                  .attr("cy", (d, i ) => {
                                      if(i == (data.length-1))
                                        return  map.project(d.LngLat).y
                                    })
                                  .attr("cx", (d, i ) => {
                                      if(i == (data.length-1))
                                      return  map.project(d.LngLat).x
                                  })
                                  .style("fill", "#3DBFC9")
                                  .on('click', (d) => {
                                      this.selectDot(d);
                                   })
                                   .on('mouseover', (d) =>{
                                       div.transition()
                                            .duration(200)
                                            .style("opacity", .9)

                                        div.html(d.text)
                                         .style("left", (map.project(d.LngLat).x+ 40)+ "px")
                                         .style("top", (map.project(d.LngLat).y) + "px")
                                   })
                                   .on("mouseout", function(d) {
                                      div.transition()
                                        .duration(500)
                                        .style("opacity", 0);
                                    })

                  //adjust all d3-elements when zoomed
                  map.on('move', (e) => {
                      var zoom = map.getZoom(e)
                      var p1 = [18.082, 59.319];
                      var p2 = [18.082 + 0.0086736, 59.319];
                      var a = map.project(p1);
                      var b = map.project(p2);
                      var radius = (b.x - a.x)

                      this.svg.selectAll('.dot').attr('cx', (d) =>{
                            return map.project(d.LngLat).x
                      })
                      .attr('cy', (d) =>{
                            return map.project(d.LngLat).y
                      })

                  })
                  map.on('moveend', (e) => {
                      this.resetBrush();
                      var bounds = map.getBounds();
                      var se= bounds.getSouthEast().wrap().toArray();
                      var nw = bounds.getNorthWest().wrap().toArray();

                      //tPreview.showDefaultView(se, nw, kaj);
                  })
    }

    brushMap() {
        var s = d3.event.selection;

        if(!s ){
            console.log('inget är markerat');
            isBrushed = false;
            d3.selectAll('circle')
                .style('fill', (d) => {
                        return '#3DBFC9';
                })
                return;
        } else {
            isBrushed = true;
            var nw = map.unproject(s[0]);
            var se = map.unproject(s[1]);
            var choosen = [];

            d3.selectAll('.dot')
                .style('fill', (d, i) => {
                    if(d.coords.coordinates[1] <= nw.lat && d.coords.coordinates[0] >= nw.lng && d.coords.coordinates[1]>= se.lat && d.coords.coordinates[0] <= se.lng){
                        choosen.push(d);
                        return '#044C29';
                    }
                    else
                        return '#3DBFC9';
                })
            tPreview.setData(choosen);
        }
    }
    selectDot(data){

        this.svg.selectAll('.dot')
            .style('fill', (d, i) => {
                    if(d.coords.coordinates[1] === data.coords.coordinates[1] && d.coords.coordinates[0] === data.coords.coordinates[0])
                        return '#044C29';

                    else return '#3DBFC9';
                })
        //tPreview.showClusterOfTweets(theData);*/
    }
    //reset brush on zoom and on click
    resetBrush(){
        if(isBrushed === true)
            this.svg.call(brush, null);
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
                    a.push(data[i])
                }
            }
            b.tweets = a;
            return b;
        }

        return newObj;
    }
}
export default Mapbox;
