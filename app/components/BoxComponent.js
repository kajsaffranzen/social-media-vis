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
        var text = document.createElement('h4');
        text.innerHTML = 'HEJ'
        document.getElementsByClassName('infoBox')[0].appendChild(text)
        document.getElementsByTagName('h4')[0].className += 'data-procent';

    }
    updateTwitter(data, index){
        //update box with chosen data from the map
        let nrOfTweets = data[index].length;
        let nrOfObjects = data[0].length + data[1].length +data[2].length;
        let res = nrOfTweets/nrOfObjects;
        document.getElementsByClassName('data-procent')[0].innerHTML = res+' %';

    }
}
export default BoxComponent;
