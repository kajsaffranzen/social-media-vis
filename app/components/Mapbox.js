import mapbox from 'mapbox-gl';
import _ from 'underscore';
import moment from 'moment'
import tz from 'moment-timezone'
import TwitterWidgetsLoader from 'twitter-widgets'
import Cluster from './Kmeans';
import TwitterPreview from './TwitterPreview.js'
import BoxComponent from './BoxComponent';

var d3 = require('d3');
var json = require('d3-request');

let map;
let cluster;
let tPreview;
let box;
let div;
let brush;
let isBrushed;
let colors = ['#124C02', '#27797F', '#3DBFC9'];

class Mapbox {
    constructor(){
        isBrushed = false;
        this.geoTweets = [];
        this.noneGeoTweets = [];
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
        this.height = document.getElementById('map').clientHeight;
        this.width = document.getElementById('map').clientWidth;


        //Set up d3
        var container = map.getCanvasContainer();

        this.svg = d3.select(container).append("svg")
                            .attr('width', this.width)
                            .attr('height', this.height)


        div = d3.select(container).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        brush = d3.brush().on("end", this.brushMap);

        this.svg.append("g")
                .attr("class", "brush")
                .call(brush);

        //labels for showing nr of Tweets
        let infoTxt = ['with geo location', 'total number of tweets']
        this.svg.selectAll('text.title')
                            .data(infoTxt)
                            .enter()
                            .append('text')
                            .attr('class', 'text-title')
                            .attr('x', 50)
                            .attr('y', (d, i) => { return this.height- (15 + (i*20)) })
                            .style('text-anchor', 'left')
                            .text((d) => { return d});

        this.updateNumbers(0, 0);
        tPreview = new TwitterPreview();
        box = new BoxComponent();

    }
    newSearch(){
        isBrushed = false;
        this.geoTweets = [];
        this.noneGeoTweets = [];
        this.nrOfTweets = 0;
        this.updateNumbers(0, 0);
        /*box.updateNumberOfCoordTweets(this.nrOfTweets);
        box.updateNumberGeoTweets(0);*/
        this.svg.selectAll('.dot').remove();
    }
    //Center map based on search result
    centerMap(coords){
        map.flyTo({
            center: [coords[0], coords[1]],
            zoom: 10,
            bearing: 0
          });
    }
    checkTopic(data, topic){
        let str = data.text.toString();
        if(str.toLowerCase().indexOf(topic) >= 0)
            data.containsTopic = true;
        else data.containsTopic = false;
        return data;
    }
    addStreamData(data, topic){
        this.nrOfTweets++;

        //check if the tweet containts the search topic
        if(topic)
            data = this.checkTopic(data, topic)

        //convert created_at to right time zone
        var time = moment(data.created_at);
        data.date = time.tz('Europe/Stockholm').format();

        if(data.coords != null){
            data.LngLat = new mapbox.LngLat(data.coords.coordinates[0], data.coords.coordinates[1]);
            this.geoTweets.push(data)
            this.testDraw(this.geoTweets)
        }
        else if (data.geo != null){
            data.LngLat = new mapbox.LngLat(data.coords.coordinates[1], data.coords.coordinates[0]);
            this.geoTweets.push(data)
            this.testDraw(this.geoTweets)
        } else this.noneGeoTweets.push(data)

        this.updateNumbers(this.nrOfTweets, this.geoTweets.length)
        //box.updateNumberOfCoordTweets(this.nrOfTweets);
    }
    updateNumbers(allTweets, hasGeo){
        this.svg.selectAll('.text-value').remove();
        let tweets = [hasGeo, allTweets]

        var hej = this.svg.selectAll('text.value')
                            .data(tweets)
                            .enter()
                            .append('text')
                            .attr('class', 'text-value')
                            .attr('x', 20)
                            .attr('y', (d, i) => { return this.height- (15 + (i*20)) })
                            .style('text-anchor', 'left')
                            .text((d) => { return d});
    }
    testDraw(data){
        //this.updateNumbers(this.nrOfTweets, data.length)
        //box.updateNumberGeoTweets(data.length);
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
                                  .style('fill', (d) => {
                                      if(d.containsTopic)
                                            return colors[0]
                                      else return colors[1];
                                  })
                                  .on('click', (d) => {
                                      this.selectDot(d);
                                   })
                                   .on('mouseover', (d) =>{
                                       div.transition()
                                            .duration(200)
                                            .style("opacity", .9)
                                            div.html('hej')
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
                    if(d.containsTopic)
                          return colors[0]
                    else return colors[1];
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
                        if(d.containsTopic)
                              return colors[0]
                        else return colors[1];
                })
            tPreview.removeTweets();
            tPreview.setData(choosen);
        }
    }
    selectDot(data){

        this.svg.selectAll('.dot')
            .style('fill', (d, i) => {
                    if(d.coords.coordinates[1] === data.coords.coordinates[1] && d.coords.coordinates[0] === data.coords.coordinates[0])
                        return colors[2];
                    else{
                        if(d.containsTopic)
                              return colors[0]
                        else return colors[1];
                    }
                })
                tPreview.removeTweets();
                tPreview.showObject(data);
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
