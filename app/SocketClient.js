import MapBox from './components/Mapbox'

class SocketClient {
    constructor(theMap){
        this.io = require('socket.io-client')('http://localhost:3000/');
        this.map = theMap;
        this.coord = '';
        this.topic = null;
        this.init();
    }
    init(){
        //setup socket connection with server
        this.io.on('connect', () => {
            this.io.emit('join', 'Connected with SocketClient');
        })
        this.io.on('connected', function(input){
            console.log('currentKeyword ', input);
        })
    }
    //FUNKAR EJ!!
    socketReconnect(){
        this.io.disconnect();
        this.io.reconnect();
    }
    //update topic
    updateTopic(input){
        console.log(' i updateTopic ', input);
        this.topic = input;
    }

    //send new coordinates to client
    updateCoordinates(input){
        //this.socketReconnect();
        this.io.emit('update-coords', input);

        //socket has received a new tweet
        this.io.on('twitter-stream',  (tweet) => {
            console.log('fått en streem');
            this.map.addStreamData(tweet, this.topic);
            /*if(this.topic != null)
                this.map.addTopicData(tweet, this.topic);*/
        })
    }
}
export default SocketClient;
