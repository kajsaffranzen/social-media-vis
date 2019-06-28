/*
* Handles all data fetching for Twitter API
*/
import p from 'es6-promise';
import $ from 'jquery';
import { createLngLat } from './utils.js';

export function getDefaultTwitterData(coordinates) {
  console.log('i export getDefaultTwitterData');
  // this.map = map;
  return new p.Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: '/twitter/'+coordinates.lat+'/'+coordinates.lng+'/range/2018-09-08',
    }).then((res) => {
      console.log('i res');
      resolve(res);
    });
  })
}

export function getNextDataIteration(url) {
  return new p.Promise((resolve, reject) => {
      console.log('i getNextDataIteratio promis ', url);
    $.ajax({
      type: 'GET',
      url: '/twitter/maxID/'+url,
    }).then((res) => {
      console.log('i res');
      resolve(res);
    });
  })
}
