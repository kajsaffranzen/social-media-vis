/*
Creates and shows a simple preview for tweets from the chosen area
The shown tweets are based on what kind of filter the user wants
*/

import _ from 'underscore';
import $ from 'jquery';
var TwitterWidgetsLoader = require('twitter-widgets');

class TwitterPreview {
    constructor(){
        this.filter = 'random';
        this.data = 0;
        this.index = 10;
        this.init();
    }
    init(){
        //create defaul filters
        let filterTypes = ['Most retweeted', 'Recent', 'Random'];
        for(var i = 0; i < filterTypes.length; i++){
            var node = document.createElement('div');
            node.innerHTML = '<input type="checkbox" id="check' + i + '"class="checkBox" name="check' + i + '"><label for="check' + i + '">'+ filterTypes[i]+'</label>';
            document.getElementsByClassName('tweet-preview')[0].appendChild(node);
        }

    }
    //Fill each box with data
    setData(inputData, inputIndex){
        this.index = inputIndex;
        this.data = inputData;

        let shows = 3;
        if(this.data.length < shows)
            shows = this.data.length;

        for(var i = 1; i < shows; i++)
            document.getElementById('tweet_'+i).innerHTML = this.data[i].text;

        $("#check0").on("click", () => {
            $('#check2').prop('checked', false);
            $('#check1').prop('checked', false);
            this.filter = 'retweets_count';
            this.filterData();
        })
        $("#check1").on("click", () => {
            $('#check0').prop('checked', false);
            $('#check2').prop('checked', false);
            this.filter = 'time';
            this.filterData();
        })
        $("#check2").on("click", () => {
            $('#check0').prop('checked', false);
            $('#check1').prop('checked', false);
            this.filter = 'random';
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
        for(var i = 1; i < 3; i++){
            document.getElementById('tweet_'+i).innerHTML = sortedData[sortedData.length-i].text;
        }
    }
}

export default TwitterPreview;
