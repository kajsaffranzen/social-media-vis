var twitt = require('twitter');
var OAuth = require('oauth');
var https = require('https');
var request = require('request');
var p = require('es6-promise');
var _ = require('underscore');

//var testPath = '/1.1/search/tweets.json?max_id=856381551646474241&q=%23svtstockholm&count=3&include_entities=1&result_type=recent';
var resultT = ',3km&result_type=recent&count=100';
var nextTweet = '?q=%23svtstockholm&count=0&result_type=recent';
var testPath = '/1.1/search/tweets.json';

var pathT = '/1.1/search/tweets.json?';


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

var cleanTwitterDataRoute = require('./cleanTwitterData.js');

module.exports = {
     getTwitterData(coords){
        var dataObj = [];
        var theCoords = coords.split(',');
        return new p.Promise(function(resolve){
            //The token gets put into the headers of our HTTPS request:
            oauth2.getOAuthAccessToken('', {
                'grant_type': 'client_credentials'
            }, function (e, access_token) {
                    var counter = 0;
                    var searchPath='q=&geocode='+theCoords[0]+','+theCoords[1]+resultT;
                    test(searchPath);
                    function test(thePath){
                        //console.log(access_token); //string that we can use to authenticate request
                        console.log('path: ' + pathT+thePath);
                        var options = {
                            hostname: 'api.twitter.com',
                            path: pathT+thePath,
                            //path: testPath+nextTweet,
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

                                dataObj.push(tweets.statuses)
                                if(tweets.search_metadata.next_results == null)
                                    console.log('next finns ej');
                                else
                                     console.log('next_results: ', tweets.search_metadata.next_results);
                                        nextTweet = tweets.search_metadata.next_results

                                counter++;
                                if(counter < 1)
                                    test(nextTweet);
                                else {
                                    var promise = cleanTwitterDataRoute.cleanData(dataObj);
                                    promise.then(function(response){
                                        console.log('har rensat data och fått tillbaka');
                                        //console.log(response);
                                        resolve(response);
                                    })
                                }
                                //console.log(tweets) //the tweets
                                console.log('väntar på data i TwitterAPI');
                            });
                        });
                }
            });
        })
    }

}
