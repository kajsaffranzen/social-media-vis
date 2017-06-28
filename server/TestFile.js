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
         console.log('today ', moment().format('YYYY-MM-DD'));
         console.log('sju dagar ', moment().subtract(7, 'day').format('YYYY-MM-DD'));
         //console.log(h);*/
         return new p.Promise(function(resolve) {
             var last_day = moment().subtract(8, 'day').format('YYYY-MM-DD');

            var first_url = 'q='+input+'&geocode='+lat+','+lng+',40km&type=recent&count=1';


            //var first_url2= 'q='+input+'&geocode='+lat+','+lng+',40km&max_id=876344148122636300&until=2017-06-19&count=100';
            getData(since, until, first_url);

             function getData(sinceDate, untilDate, url){

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
                                console.log(data.statuses[i]);
                                var tweet = {"text" : data.statuses[i].text, "created_at": data.statuses[i].created_at, "coords": data.statuses[i].coordinates, "entities": data.statuses[i].entities.hashtags };
                                obj.push(tweet)
                         }
                         if(index < 2){
                             index++;
                             //console.log('index ', index);
                             var u = moment().subtract(index+1, 'day').format('YYYY-MM-DD');
                             //console.log(data.search_metadata.refresh_url);
                             if(data.search_metadata.next_results){
                                 var max_id = data.statuses[data.statuses.length-1].id_str - 1;
                                 var n = data.search_metadata.next_results.split('&q');
                                 var new_url = 'max_id='+max_id+'&q'+n[1];
                                 console.log('new_url ', new_url);
                                 getData(u, sinceDate, new_url)
                             } else{
                                 console.log('SLUT');
                                 console.log('obj.length ', obj.length);
                             }



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
