import Map from './components/Mapbox'
import Search from './components/SearchComponent';
import InfoBox from './components/BoxComponent';
import TrendComponent from './components/TrendComponent';
import TopicRequest from './TopicRequest';
import SocketClient from './SocketClient';
import AppContainer from './AppContainer.js'
import React from 'react';
import ReactDOM from 'react-dom';
import SliderComponent from './components/SliderComponent'
import $ from 'jquery';
import p from 'es6-promise';
import moment from 'moment';
import _ from 'underscore';
var d3 = require('d3');

var startBtn = document.getElementById('get-data-btn');
startBtn.addEventListener('click', () => {
    startNewSearch();
}, false );

//setup all graphs
let theMap = new Map();

var socket = new SocketClient(theMap);
var topic_rquest = new TopicRequest();
var slider = new SliderComponent(theMap);
var trends =  new TrendComponent();
var search = new Search();

var twitterData = 0;
var city = '';
let topic = null;



function updateTimeInterval(){
    setInterval(function(){
        document.getElementById("time-span").innerHTML = moment().format('LTS');
     }, 1000);
}

var update;
(update = function() {
    document.getElementById("time-span")
    .innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
})();
setInterval(update, 1000);

//creates new search
function startNewSearch(){
    theMap.newSearch();
    //document.getElementById("time-span").innerHTML = moment().format('LTS');


    var promise = search.getCoordinates();
    promise.then(function(res){
        centerMapbox(res);

        //update stream API
        //socket.updateCoordinates(res.bounding_box);

        //get trending topics
        let trendCord = [res.lat, res.lng];
        trends.getTrendData(trendCord);
        document.getElementById("city-span").innerHTML = res.city;

        //get topic input
       let topicInput = document.getElementById('word-search-input').value;
        console.log('topicInput ', topicInput);
       if(topicInput)
            topic_rquest.getTwitterData(topicInput, trendCord)
        else  getTwitterData(res, topicInput);
    })
}

//setupSocket
//socketSetup();
function socketSetup(){
    io.on('connect', () => {
        io.emit('join', 'Connected with SocketClient');
    })
}


function getTwitterData(input, topic){
    console.log('input ', input);
    console.log('topic ', topic);
    topic = null;
    //TODO: ta bort sen
    /*let zone = slider.getCirclePositions();
    theMap.setTimeIntervals(zone);*/

    //get tweets
    let coord = input.lat+','+input.lng;
    console.log(coord);
    let h = new p.Promise(function(resolve, reject){
      $.ajax({
        type: 'GET',
        url: '/twitter/'+input.lat+'/'+input.lng+'/'+topic,
      }).then(function(res){
          console.log('FÄRDIG');
          console.log('Hämtat data från ', input.city);
          theMap.addSearchData(res);
          let zone = slider.getCirclePositions();
          theMap.setTimeIntervals(zone);
      });
  })
}

function centerMapbox(obj){
    var c = [obj.lng, obj.lat];
    theMap.centerMap(c);
}

function createXLS(){
    console.log(' i createXLS');
}


var a = [59.3293,18.0686]
