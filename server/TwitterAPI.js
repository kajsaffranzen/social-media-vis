var twitt = require('twitter');
var OAuth = require('oauth');
var https = require('https');
var twitterController = require('./TwitterAPI');


var OAuth2 = OAuth.OAuth2,
    twitter_consumer_key = 'Nq9EvW1fHnM7j3tl1nei7Rnuf',
    twitter_consumer_secret = 'meW7Z64nJ2CEEFFkiQqYSAPDQfAT5PJAWaiwZCUk5aieK7tzH7';

//fetch an access token
var oauth2 = new OAuth2(
  twitter_consumer_key,
  twitter_consumer_secret,
  'https://api.twitter.com/',
  null,
  'oauth2/token',
  null
);

//The token gets put into the headers of our HTTPS request:
oauth2.getOAuthAccessToken('', {
    'grant_type': 'client_credentials'
}, function (e, access_token) {
    console.log(access_token); //string that we can use to authenticate request

    var options = {
        hostname: 'api.twitter.com',
        path: '/1.1/statuses/user_timeline.json?screen_name=glasklart',
        headers: {
            Authorization: 'Bearer ' + access_token
        }
    };

    https.get(options, function (result) {
        var buffer = '';
        result.setEncoding('utf8');
        result.on('data', function (data) {
            buffer += data;
        });
        result.on('end', function () {
            var tweets = JSON.parse(buffer);
            console.log(tweets); // the tweets!
        });
    });
});



/*app.get('/api/users', function(req, res) {
  var user_id = req.param('id');
  var token = req.param('token');
  var geo = req.param('geo');

  res.send(user_id + ' ' + token + ' ' + geo);
});*/

//Routers
/*var router = express.Router();

router.use(function(req, res, next){
  //log each request
  console.log(req.method, req.url);
  next();
})


// POST http://localhost:3000/api/users
router.post('/api/users', function(req, res) {
	var user_id = req.body.id;
	var token = req.body.token;
	var geo = req.body.geo;
  var hej = 'kajsa';
  console.log(hej);
	res.send(hej);
});

router.get('/api', function(req, res) {
    res.send('this is a sample!');
});

app.use('/', router);*/
