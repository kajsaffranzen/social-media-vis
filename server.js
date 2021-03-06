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

var getTwitterRoute = require('./server/TwitterAPI.js');
var getTwitterTestRoute = require('./server/TwitterTest.js');
//var getTwitterStreamRoute = require('./server/TwitterStream.js');

//Setup socket.io functions passing through the socket.io & twit instances
require('./server/TwitterStream.js')(io);


app.get('/:social/:lat/:lng/:word', function(req, res) {

  console.log(` i get /${req.params.social} /:coords: ${req.params.coords}`);
 if (req.params.social === 'twitter') {
     console.log(' req.params.lat', req.params.lat);
     console.log(' req.params.lng ', req.params.lng);
     console.log(' req.params.word ', req.params.word);
     // make twitter
     //var promise = getTwitterRoute.getTwitterData(req.params.coords)
     var promise = getTwitterTestRoute.getContentData(req.params.word, req.params.lat, req.params.lng);
     promise.then(function(response){
        console.log('send data to client..')
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

app.get('/twitter-trend/:lat/:lng', function(req, res) {
    console.log(' i Trend: ', req.params.lat + req.params.lng );
    var c = [req.params.lat, req.params.lng]
    var promise = getTwitterTrendRoute.getTwitterData(c);

    promise.then(function(response) {
        res.send(response);
    }, function(reason){
        res.status(500).send({error: 'Something failed'});
    });
})


app.get('/twitter/content/:word/:lat/:lng', function(req, res) {
    console.log('i word search: '+ req.params.word +' params ' +req.params.lat + '   ' + req.params.lng);
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
