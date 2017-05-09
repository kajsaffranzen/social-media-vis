import Map from './components/Mapbox'
import Search from './components/SearchComponent';
import AppContainer from './AppContainer.js'
import React from 'react';
import ReactDOM from 'react-dom';
var d3 = require('d3')

var io = require('socket.io-client')('http://localhost:3000/');

/*io.on('connect', function(data) {
    console.log('det här gick ju bra');
    io.emit('join', 'Hello World from client');
})*/
document.getElementById('search-button').addEventListener("click", getCoord);

let kajsa = new Map();
var coords =  [18.082, 59.319];
kajsa.centerMap(coords);

var search = new Search();
function getCoord(){
    var promise = search.getCoordinates();
    promise.then(function(res){
        centerMapbox(res);
    })
}

function centerMapbox(obj){
    var c = [obj.lng, obj.lat];
    kajsa.centerMap(c);
}

var a = ['h','he','hej'];
var test = a.map(a => a.length);





/*ReactDOM.render(<AppContainer/>, document.getElementById('hello'));

import SearchAction from './actions/SearchAction';
SearchAction.addTodo('My first task');*/
