var path = require('path');
var express = require('express');
var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);
var PORT = process.env.PORT || 3000;
require('dotenv').config();


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

// Serve index.html in dist folder
app.get('*', function(request, response) {
  response.sendFile(__dirname + '/dist/index.html')
});

var router = express.Router(),
  path = require('path'),
  twitt = require('twitter');

/*var r = require('./routes/index');
app.use('/', require('./routes/index'));*/



app.listen(PORT, function(error) {
  if (error) {
    console.error(error);
  } else {
    console.info("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  }
});
