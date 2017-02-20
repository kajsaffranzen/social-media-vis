var express = require('express');
var router = express.Router();
var twitt = require('twitter');
var path = require('path');

var twitter = new twitt({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMUER_SECRET,
  access_token_key: process.env.TWITTER_TOKEN_KEY,
  access_token_secret:process.env.TWITTER_ACCESS_TOKEN_SECRET
});


router.get('/stream', function(req, res, next) {
  twitter.stream('statuses/filter', {track: 'NYC'}, function(stream) {
    stream.on('data', function(tweet){
      console.log(tweet.text);
    });

    stream.on('error', function(error) {
      throw error;
    });
  });
});

module.exports = router;
