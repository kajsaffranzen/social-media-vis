var express = require('express');
var twitt = require('twitter');
var path = require('path');
var OAuth = require('oauth');
var https = require('https');
var router = express.Router();
require('dotenv').config();


//var getTwitterData = require('../app/SearchService.js');


/*var twitter = new twitt({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMUER_SECRET,
  access_token_key: process.env.TWITTER_TOKEN_KEY,
  access_token_secret:process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//console.log(twitter.options);

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
);*/

//The token gets put into the headers of our HTTPS request:
/*oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
}, function (e, access_token) {
    console.log(access_token); //string that we can use to authenticate request

    var options = {
        hostname: 'api.twitter.com',
        path: '/1.1/statuses/user_timeline.json?screen_name=almhultsif&result_type=recent',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    };

    https.get(options, function (result) {
        var buffer = '';
        result.setEncoding('utf8');
        result.on('data', function (data) {
            buffer += data;
        });
        result.on('end', function () {
            var tweets = JSON.parse(buffer);
            console.log(tweets); // the tweets!
        });
    });
});*/




//URL: https://stream.twitter.com/1.1/statuses/sample.json
/*router.get('/stream', function(req, res, next) {
  twitter.stream('statuses/filter', {track: 'NYC'}, function(stream) {
    stream.on('data', function(tweet){
      console.log(tweet.text);
    });

    stream.on('error', function(error) {
      throw error;
    });
  });
});*/

module.exports = router;
