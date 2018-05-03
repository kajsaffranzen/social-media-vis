var d3 = require('d3');
import Map from './components/Mapbox'
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



var startBtn = document.getElementById('get-data-btn');
startBtn.addEventListener('click', () => {
    startNewSearch();
}, false );

//setup all graphs
let theMap = new Map();

var socket = new SocketClient(theMap);
var topic_rquest = new TopicRequest(theMap);
var slider = new SliderComponent(theMap);
var trends =  new TrendComponent(topic_rquest);
var search = new Search();

var twitterData = 0;
var city = '';
let topic = null;

function updateTimeInterval(){
    setInterval(function(){
        document.getElementById("time-span").innerHTML = moment().format('LTS');
     }, 1000);
}


//creates new search
function startNewSearch(){
    theMap.newSearch();

    //document.getElementById("time-span").innerHTML = moment().format('LTS');

    var promise = search.getCoordinates();
    promise.then(function(res){
        centerMapbox(res);

        //update stream API
        socket.updateCoordinates(res.bounding_box);

        //get trending topics
        let trendCord = [res.lat, res.lng];
        let place = res.city;
        trends.getTrendData(trendCord, place);
        document.getElementById("city-span").innerHTML = place;

        //get topic input
       let topicInput = document.getElementById('word-search-input').value;
        console.log('topicInput ', topicInput);
        if(topicInput) {
          topic_rquest.getTwitterData(topicInput, trendCord, place)
        } else {
          getTwitterData(res, topicInput);
        }
    })
}

function getTwitterData(input, topic){
    console.log('input ', input);
    console.log('topic ', topic);
    topic = null;

    document.getElementById('fetching-data-status').innerHTML = 'fetching data...';

    //get tweets
    let coord = input.lat+','+input.lng;
    console.log(coord);
    let h = new p.Promise(function(resolve, reject){
      $.ajax({
        type: 'GET',
        url: '/twitter/'+input.lat+'/'+input.lng+'/'+topic,
      }).then(function(res){
          console.log('FÄRDIG: ' + res.length);
          console.log('Hämtat data från ', input.city);
          document.getElementById('fetching-data-status').innerHTML = 'data fetch, ' + res.length;
          theMap.addSearchData(res);
          let zone = slider.getCirclePositions();
          theMap.setTimeIntervals(zone);
          topic_rquest.drawLineGraph(res)
      });
  })
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
