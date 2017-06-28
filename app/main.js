import Map from './components/Mapbox'
import Search from './components/SearchComponent';
import InfoBox from './components/BoxComponent';
import TrendComponent from './components/TrendComponent';
import SliderComponent from './components/SliderComponent';
import TopicRequest from './TopicRequest';
import SocketClient from './SocketClient';
import AppContainer from './AppContainer.js'
import React from 'react';
import ReactDOM from 'react-dom';

var d3 = require('d3');

import $ from 'jquery';
import p from 'es6-promise';


//add functionality to input fields
var input = document.getElementById('searchInput');
input.addEventListener("keydown", (e) =>{
    if(event.keyCode == 13)
        getCoord();
});
var word_input = document.getElementById('word-search-input');
word_input.addEventListener("keydown", (e) =>{
    if(event.keyCode == 13)
        getTopicData();
});

var startBtn = document.getElementById('get-data-btn');
startBtn.addEventListener('click', () => {
    startNewSearch();
}, false );

import moment from 'moment';
import _ from 'underscore';

//setup all graphs
let theMap = new Map();
let slider = new SliderComponent();
var socket = new SocketClient(theMap);
var topic_rquest = new TopicRequest();


var twitterData = 0;
var city = '';
let topic = null;

var trends =  new TrendComponent();

var search = new Search();

//creates new search
function startNewSearch(){
    theMap.newSearch();

    var promise = search.getCoordinates();
    promise.then(function(res){
        centerMapbox(res);

        //update stream API
        socket.updateCoordinates(res.bounding_box);

        //get trending topics
        let trendCord = [res.lat, res.lng];
        trends.getTrendData(trendCord);

        //get topic input
        let topicInput = document.getElementById('word-search-input').value;
        if(topicInput)
            topic_rquest.getTwitterData(topicInput, trendCord)
    })
}

//get coords for location input
function getCoord(){
    var promise = search.getCoordinates();
    promise.then(function(res){
        centerMapbox(res);
        socket.updateCoordinates(res.bounding_box);
        //get trending topics
        let trendCord = [res.lat, res.lng];
        topic_rquest.getTwitterData(document.getElementById('word-search-input').value, trendCord)

        //console.log(trendCord);
        trends.getTrendData(trendCord);
        var c = [ {lat: 57.714653, lng: 11.966836}];
        //theMap.addData(c)
        //getTwitterData(res);
    })
}
//setupSocket
//socketSetup();
function socketSetup(){
    io.on('connect', () => {
        io.emit('join', 'Connected with SocketClient');
    })
}

function getTopicData(){
    topic = document.getElementById('word-search-input').value;
    /*socket.updateTopic(topic);
    console.log('i topic data ', topic);*/
}



function getTwitterData(input){
    console.log('input ', input);
    //get tweets
    let coord = input.lat+','+input.lng;
    let h = new p.Promise(function(resolve, reject){
      $.ajax({
        type: 'GET',
        url: '/twitter/'+coord,
      }).then(function(res){
          console.log('Hämtat data från ', input.city);
          twitterData = res;
          theMap.addData(res);
          info.updateCity(input.city);
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
