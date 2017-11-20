var OAuth = require('oauth');
var https = require('https');
var env = require('node-env-file');
var p = require('es6-promise');
var moment = require('moment');
var tz = require('moment-timezone');

var index = 0;
var access_token = 0;
var obj;

var self = module.exports = {
    getContentData(input, lat, lng){
        var first_url = '';
        console.log('i getContentData-function, TwitterTest.js ', input);

        if(input === 'null')
            first_url = 'q=&geocode='+lat+','+lng+',20km&type=recent&count=100';
        else
            first_url = 'q='+input+'&geocode='+lat+','+lng+',40km&type=recent&count=100';

        index = 0;
        return new p.Promise(function(resolve) {
            console.log(' i promise');
            var promise = self.getAccessToken();
            promise.then(function(response){
                console.log('har hämtat access_token');
                access_token = response;

                //get the data
                var nextPromise = self.getData(first_url);
                nextPromise.then(function(res){
                    console.log('have recieved data and sending it back to server.js ', res.length);
                    resolve(res);
                })
            })
        });
    },
    getData(first_url){
        console.log(' fetching data from Twtitter API');
        obj = [];

        return new p.Promise(function(resolve) {
            //var first_url = 'q='+input+'&geocode='+lat+','+lng+',40km&type=recent&count=100';
            getTweets(first_url);
            function getTweets(url){
                var options = {
                    hostname: 'api.twitter.com',
                    path: '/1.1/search/tweets.json?' + url,
                    headers: {
                        Authorization: 'Bearer ' + access_token
                    }
                };
                https.get(options, function(result) {
                    var buffer = '';
                    result.setEncoding('utf8');
                    result.on('data', function (data) {
                        buffer += data;
                    });

                    result.on('end', function () {
                        var data = JSON.parse(buffer);
                        //console.log(data.search_metadata);
                        if(data.statuses.length){
                            for(var i = 0; i < data.statuses.length; i++){
                                var time = moment(data.statuses[i].created_at);
                                var tweet = {
                                    "coords": data.statuses[i].coordinates,
                                    "geo": data.statuses[i].geo,
                                    "place": data.statuses[i].place,
                                    "id":data.statuses[i].id_str,
                                    "text" : data.statuses[i].text,
                                    "created_at": time.tz('Europe/Stockholm').format(),
                                    "retweet_count": data.statuses[i].retweet_count,
                                    "name": data.statuses[i].user.screen_name,
                                    "entities": data.statuses[i].entities
                                 };
                                obj.push(tweet)
                            }
                        }
                        if(data.search_metadata.next_results){
                            var max_id = data.statuses[data.statuses.length-1].id_str - 1;
                            var n = data.search_metadata.next_results.split('&q');
                            var new_url = 'max_id='+max_id+'&q'+n[1];
                            console.log('getting new new_url ');
                            getTweets(new_url)
                        } else {
                            console.log('SLUT');
                            console.log('obj.length ', obj.length);
                            resolve(obj)
                        }
                    })
                })
            }
        })
    },
    getAccessToken(){
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

           return new p.Promise(function(resolve){
               oauth2.getOAuthAccessToken('', {
                   'grant_type': 'client_credentials'
               }, function (e, access_token) {
                   resolve(access_token);
               });
           })
   }
}
