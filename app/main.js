import Map from './components/Mapbox'
import Search from './components/SearchComponent';
import InfoBox from './components/BoxComponent';
import TrendComponent from './components/TrendComponent';
import TimeComponent from './components/TimeComponent';
import AppContainer from './AppContainer.js'
import React from 'react';
import ReactDOM from 'react-dom';
var d3 = require('d3');
var io = require('./socket.js');
import $ from 'jquery';
import p from 'es6-promise';
var _ = require('underscore');

/*var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 40}, {name: 'curly', age: 60}];

var data = _.groupBy(stooges,'age')
console.log(data);
for(let value in data){
    console.log(value);
    console.log(data[value]);
}*/

//document.getElementById('search-button').addEventListener("click", getCoord);
var input = document.getElementById('searchInput');
input.addEventListener("keydown", (e) =>{
    if(event.keyCode == 13)
        getCoord();
});


let info = new InfoBox();

var twitterData = 0;
var city = '';
let theMap = new Map();

var search = new Search();
function getCoord(){
    var promise = search.getCoordinates();
    promise.then(function(res){
        centerMapbox(res);
        getTwitterData(res);
    })
}

var trends =  new TrendComponent();
//var time = new TimeComponent();
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

  //get trending topics
  let trendCord = [input.lat, input.lng];
  console.log(trendCord);
  trends.getTrendData(trendCord);
}

function centerMapbox(obj){
    var c = [obj.lng, obj.lat];
    theMap.centerMap(c);
}


var a = [59.3293,18.0686]
