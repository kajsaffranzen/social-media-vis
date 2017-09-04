var OAuth = require('oauth');
var https = require('https');
var env = require('node-env-file');
var p = require('es6-promise');
var moment = require('moment');

var index = 0;
var access_token = 0;
var obj = [];
var inp = 'Pakistan';
var lat1 = 59.32932349999999;
var lng1=  18.068580800000063


mainFunction(inp, lat1, lng1);

     function getAccessToken(){
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

    function mainFunction(input, lat, lng){

        //var time = moment(data.statuses[i].created_at);
            //get todays date YYYY-MM-DD

            index = 0;
            var promise = getAccessToken();
                promise.then(function(response){
                    access_token = response;
                    //get the data
                    var nextPromise = getContentData(input, lat, lng);
                    nextPromise.then(function(res){
                        console.log('i nextPromise ', res.length);

                        //console.log(res.length);
                    })
                })
    }
     function getContentData(input, lat, lng){
         console.log(' getContentData');
         //console.log(h);*/
         return new p.Promise(function(resolve) {
            var first_url = 'q=&geocode='+lat+','+lng+',20km&type=recent&count=50';
            //var first_url2= 'q='+input+'&geocode='+lat+','+lng+',40km&max_id=876344148122636300&until=2017-06-19&count=100';
            getData(first_url);

             function getData(url){

                 var options = {
                     hostname: 'api.twitter.com',
                     //today only
                     path: '/1.1/search/tweets.json?'+url,
                     //path: '/1.1/search/tweets.json?q='+input+'&geocode='+lat+','+lng+',20km&since='+sinceDate+'&count=100',
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

                         for(var i = 0; i < data.statuses.length; i++){
                                //console.log(data.statuses[i]);
                                var tweet = {"text" : data.statuses[i].text, "created_at": data.statuses[i].created_at, "coords": data.statuses[i].coordinates, "entities": data.statuses[i].entities.hashtags };
                                obj.push(tweet)
                                //console.log(tweet);
                         }
                         if(data.search_metadata.next_results){
                             var max_id = data.statuses[data.statuses.length-1].id_str - 1;
                             var n = data.search_metadata.next_results.split('&q');
                             var new_url = 'max_id='+max_id+'&q'+n[1];
                             //console.log('new_url ', new_url);
                             getData(new_url)
                         } else {
                             console.log('SLUT');
                             console.log('obj.length ', obj.length);
                             resolve(obj)
                         }

                     })
                 })

             }
         })
    }
