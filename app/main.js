import Map from './components/Mapbox'
import Search from './components/SearchComponent';
import InfoBox from './components/BoxComponent';
import AppContainer from './AppContainer.js'
import React from 'react';
import ReactDOM from 'react-dom';
var d3 = require('d3')
import $ from 'jquery';
import p from 'es6-promise';

var io = require('socket.io-client')('http://localhost:3000/');

io.on('connect', function(data) {
//    console.log('det här gick ju bra');
    io.emit('join', 'Hello World from client igen');
    io.emit('stream');
})
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

function getTwitterData(input){
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
