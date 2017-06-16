var OAuth = require('oauth');
var https = require('https');
var env = require('node-env-file');
var p = require('es6-promise');
var moment = require('moment');

var index = 0;
var access_token = 0;
var obj = [];
var inp = 'Stockholm';
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
    //d är datumet för senaste sökningen
    function getNextDate(date){
        var d = date.split('-');

        if(d[2] > 1)
            d[2] = d[2]-1;
            if(d[2] < 10)
                d[2] = '0'+d[2]
        else{
            d[2]=31;
            var t = new Date();
            d[1] = t.getMonth();
            if(d[1] < 10)
                d[1] = '0'+d[1];
        }
        return d[0]+'-'+d[1]+'-'+d[2];
    }
    function getTodaysDate(){
        var t = new Date();
        var day = t.getDate();
        var month = t.getMonth()+1;
        var year = t.getFullYear();

        if (day < 10)
                day = '0'+day;
        if(month < 10)
            month = '0'+month;

        return year+'-'+month+'-'+day;
    }
    function mainFunction(input, lat, lng){
            //get todays date YYYY-MM-DD
            var date = getTodaysDate();
            index = 0;
            var promise = getAccessToken();
                promise.then(function(response){
                    access_token = response;
                    //get the data
                    var nextPromise = getContentData(input, lat, lng, date);
                    nextPromise.then(function(res){
                        console.log('i nextPromise ', res.length);
                        //console.log(res.length);
                    })
                })
    }
     function getContentData(input, lat, lng, theDate){
         console.log(input + ' ' + lat + ' ' + lng + ' ' + theDate);

         //var hej = moment().format();
         var hej = moment().subtract(2, 'hour').format();
         console.log('hej ', hej);
         var until = moment().format('YYYY-MM-DD');
         var since = moment().subtract(1, 'day').format('YYYY-MM-DD');
         //console.log(h);*/
         return new p.Promise(function(resolve) {
            getData(since, until);

             function getData(sinceDate, untilDate){
                 console.log('since: ', sinceDate);
                 console.log('unit: ', untilDate);
                 sinceDate='2017-06-14'
                 var options = {
                     hostname: 'api.twitter.com',
                     //path: '/1.1/search/tweets.json?q=&geocode=59.32837,18.09171,10km&since='+h+'&count=100',
                     //path: '/1.1/search/tweets.json?q=&geocode=59.329323,18.068581,5km&result_type=recent&count=100',
                     //path: '/1.1/geo/search.json?query=Toronto',
                     //path: '/1.1/geo/reverse_geocode.json?lat=37.76893497&long=-122.42284884',
                     path: '/1.1/search/tweets.json?q='+input+'&geocode='+lat+','+lng+',50km&since='+sinceDate+'&until='+untilDate+'&count=10',
                     //path: '/1.1/search/tweets.json?q='+input+'&geocode='+lat+','+lng+',20km&since='+sinceDate+'&count=10',
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
                         //console.log(data.statuses.length);
                         //console.log(data.search_metadata);
                         var threshold1 = new Date(moment().subtract(5, 'minute').format());
                         var threshold2 = new Date();

                         /*console.log('threshold1', threshold1);
                         console.log('threshold2', threshold2);*/


                         for(var i = 0; i < data.statuses.length; i++){
                             //if(threshold1 < new Date(data.statuses[i].created_at)){
                                 console.log(data.statuses[i].created_at);
                                 /*if(data.statuses[i].coordinates !== null)
                                    console.log(data.statuses[i].coordinates);
                                    console.log(data.statuses[i].text);*/
                                 //console.log(data.statuses[i].id);
                                  var tweet = {"text" : data.statuses[i].text, "created_at": data.statuses[i].created_at, "coords": data.statuses[i].coordinates, "entities": data.statuses[i].entities.hashtags };
                                //  console.log(tweet);
                                  obj.push(tweet)
                             }
                         //}
                         if(index < 2){
                             index++;
                             //console.log('index ', index);
                             var u = moment().subtract(index+1, 'day').format('YYYY-MM-DD');
                             getData(u, sinceDate);
                             console.log('nästa omgång');
                         }
                         else {
                             console.log('obj.length ', obj.length);
                             //console.log(obj);
                             //resolve(obj)
                         }
                     })
                 })

             }
         })
    }
