/*
Returns a BoxComponent that shows the how many of the data points
where posted in the chosen area
*/

//TDODO: ska visa hur många tweets som har hämtats
//hur många som är från 'hemma' och hur många som har exakta positioner

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
    updateTwitterInfo(data){
        let nrOfTweets = data[0].length + data[1].length +data[2].length;
        document.getElementsByClassName('total-number')[0].innerHTML = nrOfTweets;
        document.getElementsByClassName('total-number')[1].innerHTML = nrOfTweets
    }

    updateTwitter(data, index){
        //update box with chosen data from the map
        let nrOfTweets = data[index].length;
        document.getElementsByClassName('total-number')[0].innerHTML = nrOfTweets;
        document.getElementsByClassName('total-number')[1].innerHTML = nrOfTweets
        let nrOfObjects = data[0].length + data[1].length +data[2].length;
        let res = nrOfTweets/nrOfObjects;
        document.getElementsByClassName('data-procent')[0].innerHTML = res+' %';

    }
}
export default BoxComponent;
