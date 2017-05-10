/*
Returns a BoxComponent that shows the how many of the data points
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
        /*document.getElementsByClassName('infoBox')[0].appendChild(text)
        document.getElementsByTagName('h4')[0].className += 'data-procent';*/

    }
    updateTwitterInfo(withCoords, noCoords){
        let nrOfTweets = withCoords.length + noCoords.length;
        let nrOfCoords = withCoords.length;
        document.getElementsByClassName('total-number')[0].innerHTML = nrOfTweets;
        document.getElementsByClassName('total-number')[1].innerHTML = nrOfCoords
    }

}
export default BoxComponent;
