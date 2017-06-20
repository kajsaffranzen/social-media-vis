/*
Creates and shows a simple preview for tweets from the chosen area
The shown tweets are based on what kind of filter the user wants
*/

import _ from 'underscore';
import $ from 'jquery';
import TwitterWidgetsLoader from 'twitter-widgets'

class TwitterPreview {
    constructor(){
        this.filter = 'random';
        this.data = 0;
        this.index = 3;
    }
    selectViews(se, nw, data){
        let showedData = [];
        data.forEach(function(d) {
            if(d.lat <= nw.lat && d.lng >= nw.lng && d.lat >= se.lat && d.lng <= se.lng)
                showedData.push(d);
        })
        this.setData(showedData)
    }
    removeTweets(){
        for(var i = 0; i < document.getElementsByClassName("twitter-tweet").length; i++)
            document.getElementsByClassName("twitter-tweet")[i].remove()
    }
    //Fill each box with data
    setData(input){
        let shows = 4;
        this.data = input;

        TwitterWidgetsLoader.load( (twttr) =>  {
            for(var i = 0; i < 4; i++){
                if(input.length > i)
                    twttr.widgets.createTweet(input[i].id, document.getElementsByClassName('tweet')[i]);
            }
        });

        $("#check0").on("click", () => {
            console.log(' i check0');
            $('#check2').prop('checked', false);
            $('#check1').prop('checked', false);
            this.filter = 'retweets_count';
            this.index = 0;
            this.filterData();
        })
        $("#check1").on("click", () => {
            $('#check0').prop('checked', false);
            $('#check2').prop('checked', false);
            this.filter = 'time';
            this.index = 1;
            this.filterData();
        })
        $("#check2").on("click", () => {
            $('#check0').prop('checked', false);
            $('#check1').prop('checked', false);
            this.filter = 'random';
            this.index = 2;
            var shuffle = _.shuffle(this.data);
            this.showTweets(shuffle);
        })
    }
    filterData(){
        var sortedData = _.sortBy(this.data, this.filter);
        this.showTweets(sortedData)
    }
    //updata view with new filtered data
    showTweets(sortedData){
        TwitterWidgetsLoader.load( (twttr) =>  {
            for(var i = 0; i < 4; i++){
                if(sortedData.length > i)
                    twttr.widgets.createTweet(sortedData[i].id, document.getElementsByClassName('tweet')[i]);
            }
        });
    }
    showClusterOfTweets(inputData){
        this.setData(inputData.tweets)
    }

    showDefaultView(se, nw, inputData){
        let inCurrentView = [];

        for(let value of inputData){
            if(value.lat <= nw[1] && value.lng >= nw[0] && value.lat >= se[1] && value.lng <= se[0]) {
                for(let tweet of value.tweets)
                    inCurrentView.push(tweet)
            }
        }
        this.setData(inCurrentView);
    }
    resetFilters(){
        for(var i = 0; i < this.filterTypes.length; i++)
            $('#check'+i).prop('checked', false);
    }

}

export default TwitterPreview;
