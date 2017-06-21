var path = require('path');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
require('dotenv').config();
var p = require('es6-promise');
var api = require('instagram-node').instagram();

//To be able to grab POST parameters
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// using webpack-dev-server and middleware in development environment
if(process.env.NODE_ENV !== 'production') {
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackHotMiddleware = require('webpack-hot-middleware');
  var webpack = require('webpack');
  var config = require('./webpack.config');
  var compiler = webpack(config);

  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.join(__dirname, 'dist')));


var server = require('http').createServer(app);
var io = require('socket.io')(server);



var twitter_consumer_key = 'Nq9EvW1fHnM7j3tl1nei7Rnuf',
twitter_consumer_secret = 'meW7Z64nJ2CEEFFkiQqYSAPDQfAT5PJAWaiwZCUk5aieK7tzH7';

/*var Twit = require('twit');
var T = new Twit({
      consumer_key:          twitter_consumer_key,
      consumer_secret:        twitter_consumer_secret,
      access_token:        '3079732242-y1Qj2WQI1tMskDAwuu6YenqTacFGHwyy0FXa35n',
      access_token_secret:  'xkPGOBgnnkuD3ECI5fE2d8rPnwGAdehwOHAkAGOe2feTN'
//      timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})*/


var getTwitterRoute = require('./server/TwitterAPI.js');
//var getTwitterStreamRoute = require('./server/TwitterStream.js');

//Setup socket.io functions passing through the socket.io & twit instances
require('./server/TwitterStream.js')(io);


app.get('/:social/:coords', function(req, res) {

  console.log(` i get /${req.params.social} /:coords: ${req.params.coords}`);
 if (req.params.social === 'twitter') {
     // make twitter
     var promise = getTwitterRoute.getTwitterData(req.params.coords)
     promise.then(function(response){
        console.log('skickar')
        res.send(response);
      }, function(reason){
        res.status(500).send({error: 'Something failed'});
    })
 } else {
     //make instagram
     console.log('instagram');
 }

});

var getTwitterTrendRoute = require('./server/TwitterTrend.js');
app.get('/twitter/trend/:lat/:lng', function(req, res) {
    console.log(' i Trend: ', req.params.lat + req.params.lng );
    var c = [req.params.lat, req.params.lng]
    var promise = getTwitterTrendRoute.getTwitterData(c);
    promise.then(function(response) {
//        console.log(response[0].locations);
        res.send(response);
    }, function(reason){
        res.status(500).send({error: 'Something failed'});
    });
})

var getTwitterTestRoute = require('./server/TwitterTest.js');
app.get('/twitter/content/:word/:lat/:lng', function(req, res) {
    console.log('i word search: ', req.params.word);
    console.log(req.params.lat + '    ' + req.params.lng);
    var promise = getTwitterTestRoute.getContentData(req.params.word,req.params.lat,req.params.lng);
    promise.then(function(response) {
        console.log('i content then');
        //console.log(response);
        res.send(response);
    }, function (reason) {
        res.status(500).send({error: 'Something failed with getting TwitterContentData'});
    });

})


// Serve index.html in dist folder
app.get('*', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
})

server.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});

io.on('connect', function(client) {
    //console.log('det här gick ju bra');
        client.on('join', function(data) {
            console.log(data);
        //    var test = getTwitterStreamRoute.testStream();
            { errors: [ { code: 32, message: 'Could not authenticate you.' } ] }
        });
});
