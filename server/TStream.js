/*var Twit = require('twit');
var assert = require('assert');
var env = require('../.env');

class TwitterStream {
    constructor(){
        this.twit = new Twit({
              consumer_key:         process.env.TWITTER_CONSUMER_KEY,
              consumer_secret:        process.env.TWITTER_CONSUMUER_SECRET,
              access_token:        process.env.TWITTER_TOKEN_KEY,
              access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
        });
        this.stream = null;
        this.currentKeyword = null;
        this.currentSockets = 0;

    }
    connectToSocket(io) {
        io.on('connect', (socket) => {
            this.currentSockets++;
            socket.emit('connected', this.currentKeyword);
            console.log('Socket Connected  ', this.currentSockets);

            this.currentKeyword = 'pizza';
            if(this.currentKeyword !== null && this.stream !== null)
                this.stream = this.createStream(this.currentKeyword);

            // On a socket disconnection
            socket.on('disconnect', function () {
                this.currentSockets--;
                console.log('Socket Disconnected');

                // If the stream is running and we now have no connected clients
                if (this.stream !== null && this.currentSockets <= 0) {
                    this.stream.stop(); // Stop the stream
                    this.stream = null; // Reset the stream holder back to null
                    this.currentSockets = 0; // Reset the current sockets counter
                    console.log('No active sockets, disconnecting from stream'); // Log a message
                }
            });

        });
        socket.on('new-search', (keyword) => {
            if(this.stream !== null){
                this.stream.stop(); // Stop the current stream
                console.log('Stream Stopped');
            }

        })
    }
    createTwitterStream(keyword){
        //get tweets based on location
        var tStream = this.twit.stream('statuses/filter', {locations : stock})

        tStream.on('tweet', function (data) {
          if (data.coordinates && data.coordinates !== null) {
              var tweet = {"text" : data.text, "name" : data.user.screen_name, "lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]}; // Define a new object with the information we want to pass to the client
              io.sockets.emit('twitter-stream', tweet); // Emit our new tweet to ALL connected clients
          }
      })

      return tStream;
    }
    getLocationData(coords){
        var tStream = this.twit.stream('statuses/filter', {locations : stock})
        tStream.on('tweet', function (data) {
          if (data.coordinates && data.coordinates !== null) {
              var tweet = {"text" : data.text, "name" : data.user.screen_name, "lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]}; // Define a new object with the information we want to pass to the client
              io.sockets.emit('twitter-stream', tweet); // Emit our new tweet to ALL connected clients
          }
      })
      return tStream;
    }

    getTopicData(keyword){

    }
}

export default TwitterStream;*/

var getTwitterTrendRoute = require('./TwitterTrend.js');
var a = [59.3293, 18.0686];

var promise = getTwitterTrendRoute.getTwitterData(a);
promise.then(function(res) {
    console.log('skickar respones');
    console.log(res);
    //res.send(respones);
});
