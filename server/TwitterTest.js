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
        console.log('i getContentData ', input);
        console.log('lng ', lng);
        console.log('lat ', lat);
        //get todays date YYYY-MM-DD
        //var date = self.getTodaysDate();
        index = 0;
        return new p.Promise(function(resolve) {
            console.log(' i promise');
            var promise = self.getAccessToken();
            promise.then(function(response){
                console.log('har hämtat access_token');
                access_token = response;
                //get the data
                var nextPromise = self.getData(input, lat, lng);
                nextPromise.then(function(res){
                    console.log('i nextPromise ', res.length);
                    //console.log(res.length);
                    resolve(res);
                })
            })
        });
    },
    getData(input, lat, lng){
        console.log(' i getData');
        obj = [];
        /*console.log(input + ' ' + lat + ' ' + lng + ' ' + theDate);
        var until = moment().format('YYYY-MM-DD');
        var since = moment().subtract(1, 'day').format('YYYY-MM-DD');*/

        return new p.Promise(function(resolve) {
            var first_url = 'q='+input+'&geocode='+lat+','+lng+',40km&type=recent&count=100';
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
                        for(var i = 0; i < data.statuses.length; i++){
                            var time = moment(data.statuses[i].created_at);
                            //data.date = time.tz('Europe/Stockholm').format('YYYY-MM-DD hh:mm');
                             var tweet = {"text" : data.statuses[i].text, "created_at": time.tz('Europe/Stockholm').format('YYYY-MM-DD hh:mm'), "coords": data.statuses[i].coordinates, "entities": data.statuses[i].entities.hashtags };
                             obj.push(tweet)
                        }
                        if(data.search_metadata.next_results){
                            var max_id = data.statuses[data.statuses.length-1].id_str - 1;
                            var n = data.search_metadata.next_results.split('&q');
                            var new_url = 'max_id='+max_id+'&q'+n[1];
                            console.log('new_url ', new_url);
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
    getTodaysDate(){
        var t = new Date();
        var day = t.getDate();
        var month = t.getMonth()+1;
        var year = t.getFullYear();

        if (day < 10)
                day = '0'+day;
        if(month < 10)
            month = '0'+month;

        return year+'-'+month+'-'+day;
    },
    getNextDate(date){
        var d = date.split('-');

        if(d[2] > 1)
            d[2] = d[2]-1;
            if(d[2] < 10)
                d[2] = '0'+d[2]
        else{
            d[2]=31;
            var t = new Date();
            d[1] = t.getMonth();
            if(d[1] < 10)9
                d[1] = '0'+d[1];
        }
        return d[0]+'-'+d[1]+'-'+d[2];
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
