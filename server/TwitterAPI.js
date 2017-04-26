var twitt = require('twitter');
var OAuth = require('oauth');
var https = require('https');
var request = require('request');
var p = require('es6-promise');

var pathT = '/1.1/search/tweets.json?q=&geocode=';
var resultT = ',10km&result_type=recent&count=20';

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

   getTwitterData1(coords){
       console.log('i getTwitterData');
        var promise = this.getTwitterContent(coords).then(cleanTwitterData());
        return promise;
    },
    getTwitterData(coords){
        console.log('i getTwitterContent');
        var theCoords = coords.split(',');
        return new p.Promise(function(resolve){
            //The token gets put into the headers of our HTTPS request:
            oauth2.getOAuthAccessToken('', {
                'grant_type': 'client_credentials'
            }, function (e, access_token) {
                //console.log(access_token); //string that we can use to authenticate request
                var options = {
                    hostname: 'api.twitter.com',
                    path: pathT+theCoords[0]+','+theCoords[1]+resultT,
                    headers: {
                        Authorization: 'Bearer ' + access_token
                    }
                };
                    https.get(options, function (result) {
                        console.log('i get');
                        var buffer = '';
                        result.setEncoding('utf8');
                        result.on('data', function (data) {
                            buffer += data;
                        });
                        result.on('end', function () {
                            var tweets = JSON.parse(buffer);
                            console.log('i TwitterAPI!!');
                            //console.log(tweets);
                            var promise = cleanTwitterDataRoute.getRightParameters(tweets);
                            promise.then(function(response){
                                console.log('cleaned T-data');
                                console.log(response);
                                resolve(response);
                            })
                            //var promise = cleanTwitterDataRoute.getRightParameters(tweets);
                            //console.log(tweets) //the tweets
                            console.log('hämtat');

                        });
                    });
            });
        })
    },
    cleanTwitterData(data){
        console.log('i cleanTwitterData');
        console.log(data);
        var jsonObj = [];
        for(var i=0; i<10; i++){
            if(!data.statuses[i]){
                console.log(data.statuses[i]);
            }
            else {
                if(data.statuses[i].coordinates != null){
                    var newObject = {
                        lat: data.statuses[i].coordinates.coordinates[1],
                        lng: data.statuses[i].coordinates.coordinates[0],
                        time: data.statuses[i].created_at,
                        id: data.statuses[i].id_str,
                        tweet: data.statuses[i].text
                    };
                    jsonObj.push(newObject);

                }else if(!data.statuses[i].coordinates && data.statuses[i].place)
                    console.log('i else: ' +data.statuses[i].place);
            }
        }
        return jsonObj;
    }

}
