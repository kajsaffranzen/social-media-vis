var OAuth = require('oauth');
var https = require('https');
var env = require('node-env-file');
var p = require('es6-promise');

/*var i = 'Friends';
getContentData(i);*/
var self = module.exports = {
     getAccessToken(){
        console.log('i getAccessToken');
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
    },

     getContentData(input){
         console.log(' i getContentData; ', input);
        //https://api.twitter.com/1.1/search/tweets.json?q=%23superbowl&result_type=recent
        return new p.Promise(function(resolve) {
        var promise = self.getAccessToken();
        //var promise = sgetAccessToken();
        promise.then(function(response) {
            var access_token = response;

                console.log('i promise');
                var options = {
                    hostname: 'api.twitter.com',
                    path: '/1.1/search/tweets.json?q='+input+'&geocode=57.70887,11.974559999999997,5km&count=100',
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
                        var obj = [];
                        console.log(data.statuses.length);
                        for(var i = 0; i < data.statuses.length; i++){
                             var tweet = {"text" : data.statuses[i].text, "created_at": data.statuses[i].created_at, "value": i };
                             obj.push(tweet)
                        }
                        //console.log(obj);
                        resolve(obj);
                    })
                })
            })
        })
    }
}
