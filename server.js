var path = require('path');
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
require('dotenv').config();
var p = require('es6-promise');

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
//var getTwitterStreamRoute = require('./server/TwitterStream.js');

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
    console.log('det här gick ju bra');
        client.on('join', function(data) {
            console.log(data);
        });
});
