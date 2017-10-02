import mapbox from 'mapbox-gl';
import _ from 'underscore';
import moment from 'moment'
import tz from 'moment-timezone'
import TwitterWidgetsLoader from 'twitter-widgets'
import $ from 'jquery';
import Cluster from './Kmeans';
import timeCalculation from '../timeCalculation';
import TwitterPreview from './TwitterPreview.js'
import BoxComponent from './BoxComponent';
//import SliderComponent from './SliderComponent';

var d3 = require('d3');
var json = require('d3-request');

let map;
let cluster;
let tPreview;
let box;
let div;
let brush;
let isBrushed;
let totalTweets = [];
let colors = ['#124C02', '#27797F', '#3DBFC9'];
let timeColors = ['#8C1104', '#008C43', '#003F1E']

class Mapbox {
    constructor(){
        isBrushed = false;
        this.geoTweets = [];
        this.noneGeoTweets = [];
        this.nrOfTweets = 0;
        this.REST_data = [];
        this.t_calculation = null;
        tPreview = new TwitterPreview();
        //this.slider = new SliderComponent();
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

        $("#check3").on("click", () => {
            tPreview.resetCheckboxes(3);
            tPreview.showObjects(totalTweets);
        })


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

        var color = d3.scaleThreshold()
            .domain([0, 1])
            .range(colors);

        var x = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([600, 860]);

        /*this.svg.selectAll("rect")
                .data(color.range().map(function(d) {
              d = color.invertExtent(d);
              if (d[0] == null) d[0] = x.domain()[0];
              if (d[1] == null) d[1] = x.domain()[1];
              return d;
            }))
          .enter().append("rect")
            .attr("height", 8)
            .attr("x", function(d) { return x(d[0]); })
            .attr("width", function(d) { return x(d[1]) - x(d[0]); })
            .attr("fill", function(d) { return color(d[0]); });*/

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
        box = new BoxComponent();
        this.createLegend();
    }
    //reset map for a new search
    newSearch(){
        isBrushed = false;
        this.geoTweets = [];
        this.noneGeoTweets = [];
        this.nrOfTweets = 0;
        this.updateNumbers(0, 0);
        tPreview.removeTweets();
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

    //show REST API objects
    dataPreview(timezone){
        this.svg.selectAll('.dot').remove();
        let dataSize = 0;
        let newData = [];

        //only show objects in the given interval with a opacity
        if(this.REST_data.length > 0){
            //sortera ut all data som ej har koord och index >3 .
            for(let value of this.REST_data){
                if(value.created_at < timezone[1] && value.created_at > timezone[0]){
                    dataSize++;
                    if(value.coords){
                        value.LngLat = new mapbox.LngLat(value.coords.coordinates[0], value.coords.coordinates[1]);
                        newData.push(value)
                    }
                }
                /*if(value.coords && (value.created_at < timezone[1] && value.created_at > timezone[0])){
                    value.LngLat = new mapbox.LngLat(value.coords.coordinates[0], value.coords.coordinates[1]);
                    newData.push(value)
                }*/
            }
            //drawCircles
            this.g.selectAll('circle')
                 .data(newData)
                 .enter()
                 .append("circle")
                 .attr('class', 'dot')
                 .attr("r", 10)
                  .attr("cy", (d, i ) => {
                          return  map.project(d.LngLat).y
                    })
                  .attr("cx", (d, i ) => {
                      return  map.project(d.LngLat).x
                  })
                  .style('fill', (d) => {
                        return '#124C02'
                  })
                  .style("opacity", .5)
                  .on('click', (d) => {
                      console.log('on click ', d);
                      this.selectDot(d);
                   })
                   .on('mouseover', (d) => {
                       console.log('hallå');})

            //update infobox
            this.updateNumbers(dataSize, newData.length)
        }
    }
    setTimeIntervals(timezone){
        this.t_calculation = new timeCalculation();
        this.t_calculation.createInterval(timezone[0], timezone[1])
        if(this.REST_data.length > 0)
            this.applyTimeFilter();
    }

    addSearchData(data){
        this.REST_data = data;
    }

    applyTimeFilter(){
        this.svg.selectAll('.dot').remove();
        //tilldela den ett färg-index
        this.REST_data = this.t_calculation.assignInterval(this.REST_data);
        let newData = [];
        let hasGeo = [];
        //sortera ut all data som ej har koord och index >3 .
        for(let value of this.REST_data){
            if(value.index < 4){
                if(value.coords){
                    value.LngLat = new mapbox.LngLat(value.coords.coordinates[0], value.coords.coordinates[1]);
                    hasGeo.push(value)
                }
                else newData.push(value)
            }
        }
        this.updateNumbers(newData.length, hasGeo.length)
        this.dots2 = this.svg.selectAll('circle')
             .data(hasGeo)
             .enter()
             .append("circle")
             .attr('class', 'dot')
             .attr("r", 10)
              .attr("cy", (d, i ) => { return  map.project(d.LngLat).y })
              .attr("cx", (d, i ) => { return  map.project(d.LngLat).x })
              .style('fill', (d) => {
                    return timeColors[d.index]
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
          .on('mouseover', (d) => {
              /*div.transition()
                   .duration(200)
                   .style("opacity", .9)
                   div.html('hej')
                   .style("left", (map.project(d.LngLat).x+ 40)+ "px")
                   .style("top", (map.project(d.LngLat).y) + "px")*/
          })
          .on('click', (d) =>{
              this.selectDot(d);
          })

      })
    }
    checkTopic(data, topic){
        let str = data.text.toString();
        if(str.toLowerCase().indexOf(topic) >= 0)
            data.containsTopic = true;
        else data.containsTopic = false;
        return data;
    }
    //adding the data from Stream API to the map
    addStreamData(data, topic){
        this.nrOfTweets++;
        totalTweets.push(data);

        //check if the tweet containts the search topic
        if(topic)
            data = this.checkTopic(data, topic)

        //convert created_at to right time zone
        var time = moment(data.created_at);
        data.date = time.tz('Europe/Stockholm').format();
        //data = this.t_calculation.assignIntervalToObject(data);
        //data = this.t_calculation.assignInterval(data);
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

    //draw legend to describe the meaning of the colors on the circle
    createLegend(){
        var defs = this.svg.append("defs");
        var gradient = defs.append("linearGradient")
            .attr("id", "svgGradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr('class', 'start')
            .attr("offset", "0%")
            .attr("stop-color", "#FCA107")
            .attr("stop-opacity", 1);

        gradient.append("stop")
            .attr('class', 'end')
            .attr("offset", "100%")
            .attr("stop-color", "#7F3121")
            .attr("stop-opacity", 1);

        var legend = this.svg.insert('rect')
            .attr('class', 'legend')
            .attr('x', this.width-150)
            .attr('y', this.height-60)
            .attr('height', 15)
            .attr('width', 100)
            .style('fill', 'url(#svgGradient)')

        var legend_text = this.svg.insert('text')
            .attr('class', 'legend-text')
            .attr('x', this.width-150)
            .attr('y', this.height-30)
            .attr('height', 15)
            .attr('width', 100)
            .text('Time');
    }
    //drawCircles(data)
    testDraw(data){
        this.dots = this.svg.selectAll('circle')
             .data(data)
             .enter()
             .append("circle")
             .attr('class', 'dot')
             .attr("r", 10)
              .attr("cy", (d, i ) => {
                  if(i == (data.length-1) && d.index > 3)
                    return  map.project(d.LngLat).y
                })
              .attr("cx", (d, i ) => {
                  if(i == (data.length-1) && d.index > 3)
                  return  map.project(d.LngLat).x
              })
              .style('fill', (d) => {
                  if(d.containsTopic)
                        return colors[0]
                  else return timeColors[2];
              })
              .on('click', (d) => {
                  this.selectDot(d);
               })
               .on('mouseover', (d) =>{
               })
               .on("mouseout", function(d) {
                  div.transition()
                    .duration(500)
                    .style("opacity", 0);
                })

        //adjust all d3-elements when zoomed
        map.on('move', (e) => {
            this.resetBrush();
            var zoom = map.getZoom(e)
            var p1 = [18.082, 59.319];
            var p2 = [18.082 + 0.0086736, 59.319];
            var a = map.project(p1);
            var b = map.project(p2);
            var radius = (b.x - a.x)

            this.svg.selectAll('.dot')
                .attr('cx', (d) => {
                    return map.project(d.LngLat).x
                })
                .attr('cy', (d) =>{
                    return map.project(d.LngLat).y
                })
          })

        map.on('moveend', (e) => {
            this.resetBrush();
        })
    }
    brushMap() {
        var s = d3.event.selection;

        if(!s ){
            console.log('inget är markerat');
            isBrushed = false;
            tPreview.removeTweets();
            d3.selectAll('circle')
                .style('fill', (d) => {
                    /*if(d.containsTopic)
                          return colors[0]
                    else */return colors[1];
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
            tPreview.resetCheckboxes(10);
            tPreview.showObjects(choosen);
        }
    }
    //show a single tweet
    selectDot(data){
        this.svg.selectAll('.dot')
            .style('fill', (d, i) => {
                    if(d.id === data.id)
                        return colors[2];
                    else{
                        if(d.containsTopic)
                              return colors[0]
                        else return colors[1];
                    }
                })
        tPreview.showObject(data);
    }
    //reset brush on zoom and on click
    resetBrush(){
        if(isBrushed === true)
            this.svg.call(brush, null);
    }

}
export default Mapbox;
