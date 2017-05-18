var OAuth = require('oauth');
var https = require('https');
var request = require('request');
var p = require('es6-promise');
var _ = require('underscore');
var assert = require('assert');
var env = require('node-env-file')


var self = module.exports = {
    getTrendID(access_token, coords){
        console.log('i getTrendID: ', coords);
        var options = {
            hostname: 'api.twitter.com',
            path: '/1.1/trends/closest.json?lat='+coords[0]+'&long='+coords[1],
            headers: {
                Authorization: 'Bearer ' + access_token
            }
        };
        return new p.Promise(function(res) {
            https.get(options, function (result) {
                var buffer = '';
                result.setEncoding('utf8');
                result.on('data', function (data) {
                    buffer += data;
                });
                result.on('end', function () {
                    var tweets = JSON.parse(buffer);
                    var obj = {
                        name: tweets[0].name,
                        woeid: tweets[0].woeid
                    }
                    console.log('obj ', obj);
                    res(obj);
                })
            })
        })
    },
    getTrends(access_token, input){
        return new p.Promise(function(resolve){
            var options = {
                hostname: 'api.twitter.com',
                path: '/1.1/trends/place.json?id='+input.woeid,
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
                    console.log(tweets[0]);
                    resolve(tweets);
                })
            })
        })
    },

    getTwitterData(input){
        console.log('i getTwitterData');
        var promise = self.getAccessToken(input);
        return promise;
    },

    //fetch an access token
     getAccessToken(input) {
        var OAuth2 = OAuth.OAuth2;
        env(__dirname + '/.env');

        var oauth2 = new OAuth2(
            process.env.TWITTER_CONSUMER_KEY,
            process.env.TWITTER_CONSUMUER_SECRET,
            'https://api.twitter.com/',
            null,
            'oauth2/token',
            null
        );

        return new p.Promise(function(res){
            oauth2.getOAuthAccessToken('', {
                'grant_type': 'client_credentials'
            }, function (e, access_token) {
                var promise = self.getTrendID(access_token, input);
                promise.then(function(id_res) {
                        var trendPromise = self.getTrends(access_token, id_res);
                        trendPromise.then(function(trend_res){
                            res(trend_res)
                        })
                })
            });
        })
    }

}
