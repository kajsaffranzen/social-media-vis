var OAuth = require('oauth');
var https = require('https');
 var assert = require('assert');
var env = require('./.env');

/*var T = new Twit({
      consumer_key:          process.env.TWITTER_CONSUMER_KEY,
      consumer_secret:        process.env.TWITTER_CONSUMUER_SECRE,
      access_token:        process.env.TWITTER_TOKEN_KEY,
      access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
})*/

 //stream   = null, // Define global stream holder as we will only ever have ONE active stream
var  currentKeyword = null, // Hold the current keyword we are streaming
    currentSockets = 0; // Counter to determine number of open sockets

module.exports = function (io, twit) {

    io.on('connect', function(socket) {
        currentSockets++;
        socket.emit('connected', currentKeyword);
        console.log('Socket Connected  ', currentSockets);

        currentKeyword = 'pizza';
        if(currentKeyword !== null){
            stream = createStream(currentKeyword);
            createTopicStream(currentKeyword);
        }


        // On a socket disconnection
        socket.on('disconnect', function () {
            currentSockets--;
            console.log('Socket Disconnected');

            // If the stream is running and we now have no connected clients
            if (stream !== null && currentSockets <= 0) {
                stream.stop(); // Stop the stream
                stream = null; // Reset the stream holder back to null
                currentSockets = 0; // Reset the current sockets counter
                console.log('No active sockets, disconnecting from stream'); // Log a message
            }
        });

    });

    //Returns a new Twit stream for the passed keyword with the events attached
    function createStream(keyword) {
        console.log('i createStream: ', keyword);

        /*var stream = twit.stream('statuses/filter', {track : keyword})

        stream.on('tweet', function (data) {
            //console.log(data);
            // If the tweet has geolocation information
            if (data.coordinates && data.coordinates !== null) {
                var tweet = {"text" : data.text, "name" : data.user.screen_name, "lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]}; // Define a new object with the information we want to pass to the client
            //    console.log(tweet);
                io.sockets.emit('twitter-stream', tweet); // Emit our new tweet to ALL connected clients
            }
        });*/

        var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]
        var stock = ['59,329323','18,068581']
        var san = [ '-17.76', '59.44', '18.2', '58.23' ]
        var hej = ['17.7601322', '59.2271383', '17.7601322', '59.4402037'];
        var ny = ['-74,40','-73,41']
        var stream = twit.stream('statuses/filter', {locations : hej})
        //var stream = T.stream('statuses/filter', { locations: sanFrancisco })

        stream.on('tweet', function (data) {
            console.log(' on tweet');
            console.log(data);
          if (data.coordinates && data.coordinates !== null) {
              var tweet = {"text" : data.text, "created_at": data.created_at, "name" : data.user.screen_name, "lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]}; // Define a new object with the information we want to pass to the client
              io.sockets.emit('twitter-stream', tweet); // Emit our new tweet to ALL connected clients
          }
      })

        // Log a new connection to the stream
        stream.on('connect', function () {
            console.log('Connected to twitter stream using keyword => ' + keyword);
        });

        return stream;
    }

    function createTopicStream(keyword){
        console.log('i createTopicStream');
        var stream = twit.stream('statuses/filter', {track: 'Stockholm'} )

        stream.on('tweet', function (data) {
            console.log(data);
        })
    }

}
