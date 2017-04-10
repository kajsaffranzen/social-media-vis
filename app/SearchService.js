import http from 'http';
import $ from 'jquery';

function getTwitterContent(movie){
  console.log('i twtterContent');
  $.ajax({
    type: 'POST',
    url: '/film/movie',
    data: movie,
    success: function(data){console.log('success');}
  });
}

module.exports = {getTwitterContent}

/*var request = require('request');
var p = require('es6-promise');
var $ = require('jquery');
var URL = '/search';

var urlIMDb = 'http://www.omdbapi.com/?t=';
var pathIMDb = '&y=&plot=short&r=json';
var urlTrailerAPI = 'http://api.traileraddict.com/?imdb=';
var urlTrailer = 'https://v.traileraddict.com/';

/*function getTwitterContent(coords){
  console.log('i getTwitterContent: ' + coords);
  return new p.Promise(function(resolve, reject) {
    console.log('i retunr');
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3001/api',
      data: coord,
      success: function(data){console.log('success');}
    });
  });
}*/

/*function getData(coord){
  var promise = getTwitterContent(coord);
  //.then(getSomethingNewIfWanted)
};*/



/*function getTwitterContent(movie){
  console.log('i getTwitterContent: ' + movie);
  movie = 'non-stop';
	return new p.Promise(function(resolve) {
		request(urlIMDb+movie+pathIMDb, function(error, response, body) {
			if (!error && response.statusCode == 200) {
        console.log(response);
				resolve({'payload': body})
			}
			else {
        console.log('tråkigt');
				throw new Error("ERROR: could not get imdb");
			}
		});
	});
}



function getTwitterContent2(coord) {
  console.log('mycket spännande');
  /*return new p.Promise(function(resolve, reject){
    console.log('hej');
    request(URL, function(error, res, body){
      if(!error && res.statusCode == 200)
        console.log('fixade det');
        //TODO: send it over
      else {
        console.log(error);
        res.send(error);
      }
    });
  });*/
//};

//module.exports = {getTwitterContent: getTwitterContent};*/
