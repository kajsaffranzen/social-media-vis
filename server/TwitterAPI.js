var twitt = require('twitter');
var OAuth = require('oauth');
var https = require('https');
var request = require('request');
var p = require('es6-promise');

var pathT = 'https://1.1/search/tweets.json?q=&geocode=';
var resultT = ',10km&result_type=recent';

//TODO: implementera så att nycklarna hämtas från .env-filen
var OAuth2 = OAuth.OAuth2,
    twitter_consumer_key = 'Nq9EvW1fHnM7j3tl1nei7Rnuf',
    twitter_consumer_secret = 'meW7Z64nJ2CEEFFkiQqYSAPDQfAT5PJAWaiwZCUk5aieK7tzH7';

//fetch an access token
var oauth2 = new OAuth2(
  twitter_consumer_key,
  twitter_consumer_secret,
  'https://api.twitter.com/',
  null,
  'oauth2/token',
  null
);

var cleanTDataRoute = require('./cleanTwitterData.js');
//var obj = cleanTDataRoute.createObject();

//getTwitterData('hej,h');
/*var h = 3;
cleanTDataRoute.getRightParameters(h);*/

//module.exports = {
  //https://api.twitter.com/1.1/search/tweets.json?q=&geocode=-56.5524461,14.137404699999934,10km&result_type=recent
  //56.552446 14.137405
  //1.1/search/tweets.json?q=&geocode=56.552446,14.137405,10km&result_type=recent&count=2
  ///1.1/statuses/user_timeline.json?screen_name=Smalandsposten&result_type=recent&count=3

  function getTwitterData(coords){
    var theCoords = coords.split(',');
    console.log('i twitterapi: ' + theCoords[0] + ' ' + theCoords[1]);

    //The token gets put into the headers of our HTTPS request:
    oauth2.getOAuthAccessToken('', {
        'grant_type': 'client_credentials'
    }, function (e, access_token) {
        //console.log(access_token); //string that we can use to authenticate request
        var options = {
            hostname: 'api.twitter.com',
            path: '/1.1/search/tweets.json?q=&geocode=59.331819,18.026341,2km&result_type=recent&count=100',
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        };

        console.log('path: ' + options.path);
        https.get(options, function (result) {
            var buffer = '';
            result.setEncoding('utf8');
            result.on('data', function (data) {
                buffer += data;
            });
            result.on('end', function () {
                var tweets = JSON.parse(buffer);
                cleanTDataRoute.getRightParameters(tweets);
                //console.log(tweets) //the tweets
                console.log('hämtat');

            });
        });

    });
  }

//}
