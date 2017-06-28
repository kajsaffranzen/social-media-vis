//var OAuth = require('oauth');
//var https = require('https');
 var assert = require('assert');
var env = require('node-env-file');
var Twit = require('twit');

env(__dirname + '/.env');

var twit = new Twit({
      consumer_key:          process.env.TWITTER_CONSUMER_KEY,
      consumer_secret:        process.env.TWITTER_CONSUMUER_SECRET,
      access_token:        process.env.TWITTER_TOKEN_KEY,
      access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
})

 //stream   = null, // Define global stream holder as we will only ever have ONE active stream
var  currentKeyword = null, // Hold the current keyword we are streaming
    currentTopic = null,
    currentSockets = 0; // Counter to determine number of open sockets
var stream = null;

module.exports = function (io) {

    io.on('connect', function(socket) {

        currentSockets++;
        socket.emit('connected', 'connected with server');
        console.log('Socket Connected  ', currentSockets);

        if(currentKeyword !== null)
            stream = createStream(currentKeyword);


        socket.on('update-coords', function(coords){
            console.log('update-coords i connect ', coords);
            currentKeyword = coords;
            stream = createStream(currentKeyword);
        })

        socket.on('new-topic', function(topic) {
            console.log('i new-topic ', topic);
            currentTopic = topic;
            createTopicStream(topic);
        })

        // On a socker reconnecttion
        socket.on('reconnect', function(){
            //stream.stop(); // Stop the stream
            stream = null; // Reset the stream holder back to null
            currentSockets = 0;

        })

        // On a socket disconnection
        socket.on('disconnect', function () {
            currentSockets--;
            console.log('Socket Disconnected ', currentSockets);
            //stream = null;

            // If the stream is running and we now have no connected clients
            if (stream !== null && currentSockets <= 0) {
                stream.stop(); // Stop the stream
                stream = null; // Reset the stream holder back to null
                currentSockets = 0; // Reset the current sockets counter
                currentKeyword = null;
                console.log('No active sockets, disconnecting from stream'); // Log a message
            }
        });

    });



    //Returns a new Twit stream for the passed keyword with the events attached
    function createStream(coords) {
        //var stockholm = [ '17.7697', '59.2271', '18.1999', '59.4403' ]
        var stream = twit.stream('statuses/filter', {locations : coords})

        stream.on('tweet', function (data) {
            var tweet = {
                coords: data.coordinates,
                geo: data.geo,
                place: data.place,
                 id: data.id_str,
                 time: data.created_at,
                 text: data.text,
                 retweet_count: data.retweet_count,
                 name: data.user.screen_name
            };
          io.sockets.emit('twitter-stream', tweet);

      })

        // Log a new connection to the stream
        stream.on('connect', function () {
            console.log('Connected to twitter stream using keyword => ' + coords);
        });

        return stream;
    }



    function createTopicStream(keyword, coords){
        console.log('i createTopicStream');
        var stream = twit.stream('statuses/filter', {locations: currentKeyword, track: keyword} )
        console.log(currentKeyword + '  ' + keyword);
        stream.on('tweet', function (data) {
            //console.log('i Twitter-topic-stream och streamar');
            var tweet = {
                coords: data.coordinates,
                geo: data.geo,
                place: data.place,
                 id: data.id_str,
                 time: data.created_at,
                 text: data.text,
                 retweet_count: data.retweet_count,
                 name: data.user.screen_name
            };
            io.sockets.emit('twitter-topic-stream', tweet)
        //    io.sockets.emit('twitter-stream', data);
        })
    }

}
