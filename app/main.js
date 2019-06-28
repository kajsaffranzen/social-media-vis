var d3 = require('d3');

import Search from './components/SearchComponent';
import InfoBox from './components/BoxComponent';
import TrendComponent from './components/TrendComponent';
import TopicRequest from './TopicRequest';
import SocketClient from './SocketClient';
import SliderComponent from './components/SliderComponent'
import $ from 'jquery';
import p from 'es6-promise';
import moment from 'moment';
import _ from 'underscore';
import styles from './style.scss';


import TimeComponent from './components/TimeComponent'


// import dataSizeComponent from './components/dataSizeComponent';

import Appen from './App';
new Appen();

let theMap;
let scatterComponent;
//setup all graphs

var socket = new SocketClient(theMap);
var topic_rquest = new TopicRequest(theMap);
var slider = new SliderComponent(theMap);
var trends =  new TrendComponent(topic_rquest);
var search = new Search();

var twitterData = 0;
var city = '';
let topic = null;
let last_search_place = '';

function updateTimeInterval(){
    setInterval(function(){
        document.getElementById("time-span").innerHTML = moment().format('LTS');
     }, 1000);
}


//creates new search
function startNewSearch() {
    theMap.newSearch();
    let topicInput = document.getElementById('word-search-input').value;
    var promise = search.getCoordinates();
    promise.then(function(res){
        centerMapbox(res);

        //update stream API
        //socket.updateCoordinates(res.bounding_box);

        //get trending topics
        let trendCord = [res.lat, res.lng];
        let place = res.city;

        // check if the place has been changed or not
        if (place !== last_search_place) {
          last_search_place = place;
          trends.getTrendData(trendCord, place)

          document.getElementById("city-span").innerHTML = place;

          //get topic input

          console.log('topicInput ', topicInput);
          if(topicInput) {
            topic_rquest.getTwitterData(topicInput, trendCord, place)
          } else {
            getTwitterData(res, topicInput);
          }
        } else {
          // filter by topic
          theMap.checkTopic(null, topicInput);
        }


    })
}

function getTwitterData(input, topic){
    console.log('input ', input);
    console.log('topic ', topic);
    topic = null;

    document.getElementById('fetching-data-status').innerHTML = 'fetching data...';
}


function saveData(jsonData) {
  console.log(jsonData);
  fs.writeFile("testData.txt", jsonData, function(err) {
      if (err) {
          console.log(err);
      }
  });
}

function centerMapbox(obj){
    var c = [obj.lng, obj.lat];
    theMap.centerMap(c);
}

function createXLS(){
    console.log(' i createXLS');
}
