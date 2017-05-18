/*
    This class gets the trending topics from Twitter
    and visualize them to the user.
*/
import p from 'es6-promise';
import $ from 'jquery';

class TrendComponent {
    constructor(){
        this.chosenTopic = null;
    }
    getTrendData(coords){
        console.log('getTrendData ', coords);
        let promise = new p.Promise((resolve, reject) => {
            $.ajax({
              type: 'GET',
              url: '/twitter/trend/'+coords[0]+'/'+coords[1],
            }).then(function(res){
                console.log(res[0]);
            });
        })
    }
}

export default TrendComponent;
