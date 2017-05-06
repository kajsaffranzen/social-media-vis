/*
Returns a BoxComponent that shows how many of the data points
where posted in the chosen area
*/

class BoxComponent {
    constructor(){
        this.nrOfTweets = 0;
        this.nrOfInstagram = 0;
        this.init();
    }
    init(){
        //create empty boxes with the data
        var node = document.createElement('div');
        node.innerHTML = '<h4>TWITTER</h4>';
        //node.innerHTML = '<h4>TWITTER</h4>';
        document.getElementsByClassName('infoBox')[0].appendChild(node);

    }
    updateTwitter(data, index){
        //update box with chosen data from the map
        console.log('i updateTwitter');
        let nrOfTweets = data[index].length;
        let nrOfObjects = data[0].length + data[1].length +data[2].length;
        let res = nrOfTweets/nrOfObjects;
        document.get

    }
}
export default BoxComponent;
