import Search from './components/Search.jsx';
import SearchStore from './SearchStore';
import Map from './components/Mapbox'
import AppContainer from './AppContainer.js'
import React from 'react';
import ReactDOM from 'react-dom';
import Cluster from './components/Kmeans'
var d3 = require('d3')

var a = ['h','he','hej'];
var test = a.map(a => a.length);

let kajsa = new Map();
var coords =  [18.082, 59.319];
kajsa.centerMap(coords);

function getStore() {
  return [
    SearchStore,
  ];
}
