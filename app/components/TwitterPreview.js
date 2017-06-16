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
        this.index = 3;
        this.init();
    }
    init(){
        //create deaful views
        var div = document.createElement('div');
        document.getElementsByClassName('tweet-preview')[0].appendChild(div);

        //create defaul filters
        this.filterTypes = ['Most retweeted', 'Recent', 'Random', 'No specific location'];
        for(var i = 0; i < this.filterTypes.length; i++){
            var node = document.createElement('div');
            node.innerHTML = '<input type="checkbox" id="check' + i + '"class="checkBox" name="check' + i + '"><label for="check' + i + '">'+ this.filterTypes[i]+'</label>';
            document.getElementsByClassName('tweet-preview')[0].appendChild(node);
        }

    }
    selectViews(se, nw, data){
        let showedData = [];
        data.forEach(function(d) {
            if(d.lat <= nw.lat && d.lng >= nw.lng && d.lat >= se.lat && d.lng <= se.lng)
                showedData.push(d);
        })
        this.setData(showedData)
    }
    //Fill each box with data
    setData(inputData){
        let shows = 4;
        this.data = inputData;

        for(var i = 0; i < shows; i++){
            var element = document.getElementsByClassName('tweet')[i];
            var p = element.getElementsByTagName('p');
            var h4 = element.getElementsByTagName('h4');

            if( i >= this.data.length){
                p[0].innerHTML = ' ';
                h4[0].innerHTML = ' ';
                document.getElementsByClassName('retweets')[i].innerHTML = ' ';
                p[2].innerHTML = ' ';
            } /*else if (this.data.length === 1) {
                p[0].innerHTML = this.data.text;
                h4[0].innerHTML = this.data.name;
                document.getElementsByClassName('retweets')[i].innerHTML = this.data.retweet_count;
                p[2].innerHTML = this.data.time;
            }*/
            else {
                p[0].innerHTML = this.data[i].text;
                h4[0].innerHTML = this.data[i].name;
                document.getElementsByClassName('retweets')[i].innerHTML = this.data[i].retweet_count;
                p[2].innerHTML = this.data[i].date;
            }

        }

        $("#check0").on("click", () => {
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
        for(var i = 1; i < 5; i++){
            document.getElementById('filter-title').innerHTML = this.filterTypes[this.index] + ' Tweets';
            var element = document.getElementsByClassName('tweet')[i-1];
            var p = element.getElementsByTagName('p');
            var h4 = element.getElementsByTagName('h4');
            p[0].innerHTML = sortedData[sortedData.length-i].text;
            document.getElementsByClassName('retweets')[i-1].innerHTML = sortedData[sortedData.length-i].retweet_count;
            p[2].innerHTML = sortedData[sortedData.length-i].date;
            h4[0].innerHTML = sortedData[sortedData.length-i].name;
        }
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
