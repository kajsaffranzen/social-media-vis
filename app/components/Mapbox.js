import mapbox from 'mapbox-gl';
import _ from 'underscore';
import moment from 'moment'
import tz from 'moment-timezone'
import TwitterWidgetsLoader from 'twitter-widgets'
import $ from 'jquery';
import timeCalculation from '../timeCalculation';
import TwitterPreview from './TwitterPreview.js'
import BoxComponent from './BoxComponent';
import dataSizeComponent from './dataSizeComponent';
//import SliderComponent from './SliderComponent';

var d3 = require('d3');
var json = require('d3-request');

let map;
let cluster;
let twitterPreview;
let twitterFilter;
let box;
let div;
let brush;
let isBrushed;
let brushedArea;
let has_timefilter;
let number_info;
let totalTweets = [];
let totalNoGeoTweets = [];
let colors = ['#124C02', '#27797F', '#3DBFC9'];
let timeColors = ['#8C1104', '#008C43', '#003F1E']
let tempColor = '#000000';

class Mapbox {
    constructor(){
        isBrushed = false;
        has_timefilter = false;
        this.nrOfTweets = 0;
        this.t_calculation = null;
        this.currentTopic = null;
        this.geoTweets = [];
        this.noneGeoTweets = [];
        this.REST_data = [];
        this.containingTopic = [];
        twitterPreview = new TwitterPreview();
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

        //labels for showing nr of Tweets
        number_info = new dataSizeComponent(this.svg);
        this.updateNumbers(0, 0);
        box = new BoxComponent();
    }

    //reset map for a new search
    newSearch(){
        isBrushed = false;
        this.currentTopic = null;
        this.nrOfTweets = 0;
        this.geoTweets = [];
        this.noneGeoTweets = [];
        this.containingTopic = [];
        totalTweets = [];
        this.updateNumbers(0, 0);
        twitterPreview.removeTweets();
        this.svg.selectAll('.dot').remove();
    }

    //Center map based on search result
    centerMap(coords){
        map.flyTo({
            center: [coords[0], coords[1]],
            zoom: 8,
            bearing: 0
          });
    }

    /* updates the topic for stream data*/
    updateTopic(topic) {
        console.log('uppdaterar topic: ', topic);
        this.currentTopic = topic;
    }

    addSearchData(data){
        totalTweets = [];
        Array.prototype.push.apply(totalTweets,data);
        console.log('totalTweets: ', totalTweets.length);
        if(has_timefilter) {
            this.applyTimeFilter(totalTweets);
        }
    }

    //show all objects
    dataPreview(timezone){
        this.svg.selectAll('.dot').remove();
        let dataSize = 0;
        let newData = [];

        //only show objects in the given interval with a opacity
        if(totalTweets.length > 0){
            //sortera ut all data som ej har koord och index >3 .
            for(let value of totalTweets){
                if(value.created_at <= timezone[1] && value.created_at >= timezone[0]){
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
            this.svg.selectAll('circle')
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
        this.t_calculation = new timeCalculation(this.svg);
        this.t_calculation.createInterval(timezone[0], timezone[1]);
        has_timefilter = true;
        console.log('i setTimeIntervals: ' , totalTweets.length);
        if(totalTweets.length > 0)
            this.applyTimeFilter(totalTweets);

        /*if(this.REST_data.length > 0)
            this.applyTimeFilter(); */
    }

    hideOldData() {
        this.svg.selectAll('.dot').remove();
        has_timefilter = false;
    }

    applyTimeFilter(data) {
        this.svg.selectAll('.dot').remove();
        //tilldela den ett färg-index
        //this.REST_data = this.t_calculation.assignInterval(data);
        data = this.t_calculation.assignInterval(data);
        let newData = [];
        let hasGeo = [];
        var h = 0;
        //sortera ut all data som ej har koord och index >3 .
        //for(let value of this.REST_data){
        for(let value of data){
            if(value.index < 4){
                h++;
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

          this.svg.selectAll('.dot')
            .attr('cx', (d) => {
                return map.project(d.LngLat).x
            })
            .attr('cy', (d) =>{
                return map.project(d.LngLat).y
            })
            .on('click', (d) =>{
                this.selectDot(d);
            })
      })
    }

    brushMap() {
        var s = d3.event.selection;

        if(!s ){
            console.log('inget är markerat');
            isBrushed = false;
            twitterPreview.update_brush_status();
            d3.selectAll('circle')
                .style('fill', (d) => {
                    if(has_timefilter) {
                        return timeColors[d.index]
                    } else {
                        return colors[1];
                    }
                })

        } else {
            isBrushed = true;
            var nw = map.unproject(s[0]);
            var se = map.unproject(s[1]);
            brushedArea = [nw, se];
            var choosen = [];

            d3.selectAll('.dot')
                .style('fill', (d, i) => {
                    if(d.coords.coordinates[1] <= nw.lat && d.coords.coordinates[0] >= nw.lng && d.coords.coordinates[1]>= se.lat && d.coords.coordinates[0] <= se.lng){
                        choosen.push(d);
                        return colors[2];
                    }
                    else
                        if(d.containsTopic)
                              return colors[0]
                        else return colors[1];
                })
            // Check if any filters are set
            // TODO
            twitterPreview.update_brush_status(choosen);

        }
    }

    /*
    * a singel Tweet is selected
    */
    selectDot(data) {
      if(has_timefilter) {
        this.svg.selectAll('.dot')
          .style('opacity', (d, i) => {
            if(d.id != data.id){
              return 0.1;
            }
          })
      } else {
        this.svg.selectAll('.dot')
          .style('fill', (d, i) => {
            if(d.id === data.id)
              return colors[2];
            else{
              if(d.containsTopic) {
                return colors[0]
              } else {
                return colors[1]
              }
            }
          })
      }

      twitterPreview.showObject(data, false);
    }

    /* =========== functions for handle the streaming API   ===========*/

    // checks if the tweet contains a specific topic
    checkTopic(data, topic){
        let str = data.text.toString();
        if(str.toLowerCase().indexOf(topic) >= 0) {
            data.containsTopic = true;
            this.containingTopic.push(data);
            console.log('nämner topic!!')
        } else {
            data.containsTopic = false;
        }
        return data;
    }

    // adding the data from Stream API to the map
    addStreamData(data){
        //check if the tweet containts the search topic
        if(this.currentTopic) {
            data = this.checkTopic(data, this.currentTopic)
        }

        //if( (this.currentTopic && data.containsTopic === true ) || !this.currentTopic) {
            this.nrOfTweets++;
            totalTweets.push(data);

            //convert created_at to right time zone
            var time = moment(data.created_at);
            data.date = time.tz('Europe/Stockholm').format();

            if(has_timefilter) {
              if(this.t_calculation.withinInterval(data)) {
                  this.createLngLat(data);
              }
            } else {
                this.createLngLat(data);
            }
        //}
    }

    createLngLat(data) {
        if(data.coords != null){
            data.LngLat = new mapbox.LngLat(data.coords.coordinates[0],
              data.coords.coordinates[1]);
            this.geoTweets.push(data)
            this.withinBounds(data, this.geoTweets)
        }
        else if (data.geo != null){
            data.LngLat = new mapbox.LngLat(data.coords.coordinates[1],
              data.coords.coordinates[0]);
            this.geoTweets.push(data)
            this.withinBounds(data, this.geoTweets)
        } else {
            this.noneGeoTweets.push(data)
            totalNoGeoTweets.push(data)
        }

        this.updateNumbers(this.nrOfTweets, this.geoTweets.length)
    }

    /*
    * check if the stream data is in the brushed
    */
    withinBounds(item, data) {
      if (isBrushed) {
          this.checkBounds(item, data)
      } else {
        // Update info for preview section
        twitterPreview.update_data(totalTweets, totalNoGeoTweets);
        this.drawStreamData(data)
      }
    }

    /*
    * if the map is brushed, check if new items are within the range
    * and change the color for it for one second
    */
    checkBounds(object, data) {
      if (object.coords.coordinates[1] <= brushedArea[0].lat &&
          object.coords.coordinates[0] >= brushedArea[0].lng &&
          object.coords.coordinates[1] >= brushedArea[1].lat &&
          object.coords.coordinates[0] <= brushedArea[1].lng) {
            twitterPreview.add_single_data_object(object)

            var temp = this.svg.append('circle')
              .attr("r", 10)
              .attr("cx", map.project(object.LngLat).x)
              .attr("cy", map.project(object.LngLat).y)
              .attr("fill", tempColor);

            setTimeout(() => {
              temp.remove();
              this.drawStreamData(data, true);
            }, 800);
        } else {
          twitterPreview.update_data(totalTweets, totalNoGeoTweets);
        }
    }

    drawBrushedObjects(object, data) {
      this.svg.selectAll('.dot')
        .attr("cy", (d, i ) => {
          if (d.id === object.id) {
            return map.project(d.LngLat).y
          }
        })
        .attr("cx", (d, i ) => {
          if (d.id === object.id) {
            return map.project(d.LngLat).x
          }
        })
        .style('fill', (d, i) => {
          return colors[2];
        })
    }


    drawStreamData(data, inBounds) {
        this.dots = this.svg.selectAll('circle')
         .data(data)
         .enter()
         .append("circle")
         .attr('class', 'dot')
         .attr("r", 10)
          .attr("cy", (d, i ) => {
            if (i == (data.length-1)) {
              return  map.project(d.LngLat).y
            }
          })
          .attr("cx", (d, i ) => {
            if (i == (data.length-1)) {
              return  map.project(d.LngLat).x
            }
          })
          .style('fill', (d) => {
            if(d.containsTopic) {
              //return colors[0];
              return "#FAFF2D";
            } else if (has_timefilter) {
              return timeColors[0];
            } else if (inBounds) {
              return colors[2];
            } else {
              return colors[1];
            }
          })
          .on('click', (d) => {
            this.selectDot(d);
          })
         .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
          })

        //adjust all d3-elements when zoomed
        map.on('move', (e) => {
          if (isBrushed) {
            this.resetBrush();
          }

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
            .attr('cy', (d) => {
              return map.project(d.LngLat).y
            })

          // redraw text again
          number_info.redrawInfo();
          twitterPreview.update_data(totalTweets, totalNoGeoTweets);

        })

        map.on('moveend', (e) => {
          if (isBrushed) {
            this.resetBrush();
          }
        })
    }

    //reset brush on zoom and on click
    resetBrush(){
        if(isBrushed === true)
            this.svg.call(brush, null);
    }

    /* update info about size of the data */
    updateNumbers(allTweets, hasGeo){
        number_info.updateNumbers(allTweets, hasGeo);
    }

    /* get all tweets */
    set_all_tweets() {
        console.log('hej i Mapbox;');
    }

} export default Mapbox;
