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
            console.log('from server:  ', input);
        })
    }

    //send new coordinates to client
    updateCoordinates(input){
        this.io.emit('update-coords', input);
        //socket has received a new tweet
        this.io.on('twitter-stream',  (tweet) => {
            this.map.addStreamData(tweet);
        })
    }
}
export default SocketClient;
