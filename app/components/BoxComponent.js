/*
Returns a BoxComponent that shows the how many of the data points
where posted in the chosen area
*/


class BoxComponent {
    constructor(){
        this.nrOfTweets = 0;
        this.nrOfInstagram = 0;
        //this.init();
    }
    updateCity(city){
        document.getElementById('location').innerHTML = city;
    }
    updateTwitterInfo(withCoords, noCoords, city){
        let nrOfTweets = withCoords.length + noCoords.length;
        let nrOfCoords = withCoords.length;
        document.getElementsByClassName('total-number')[0].innerHTML = nrOfTweets;
        document.getElementsByClassName('total-number')[1].innerHTML = nrOfCoords
    }
    updateNumberOfCoordTweets(nr){
        document.getElementsByClassName('total-number')[0].innerHTML = nr;
    }
    updateNumberGeoTweets(nr){
        document.getElementsByClassName('total-number')[1].innerHTML = nr;
    }
}
export default BoxComponent;
