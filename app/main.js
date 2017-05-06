import Map from './components/Mapbox'
import AppContainer from './AppContainer.js'
import React from 'react';
import ReactDOM from 'react-dom';
var d3 = require('d3')

var io = require('socket.io-client')('http://localhost:3000/');

io.on('connect', function(data) {
    console.log('det här gick ju bra');
    io.emit('join', 'Hello World from client');
})

var a = ['h','he','hej'];
var test = a.map(a => a.length);

let kajsa = new Map();
var coords =  [18.082, 59.319];
kajsa.centerMap(coords);

ReactDOM.render(<AppContainer/>, document.getElementById('hello'));

import SearchAction from './actions/SearchAction';
SearchAction.addTodo('My first task');
