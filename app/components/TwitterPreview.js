/*
Creates and shows a simple preview for tweets from the chosen area
The shown tweets are based on what kind of filter the user wants
*/

import TwitterWidgetsLoader from 'twitter-widgets'
import _ from 'underscore';
import $ from 'jquery';
import json2xls from 'json2xls';
var fs = require('fs');

class TwitterPreview {
    constructor(){
        this.filter = '';
        this.data = 0;
        this.index = 3;
        this.init();
    }
    init(){
        var exp_button = document.getElementById('export-btn');
        exp_button.addEventListener('click', () => {
            this.createXLS();
        }, false );
        this.setFilter();
    }

    //handles all checbox functionallities
    setFilter(){
        $("#check0").on("click", () => {
            this.resetCheckboxes(0);
            this.filter = 'entities.media';
            this.index = 0;
            let hasMedia = [];
            for(let value of this.data){
                if(value.entities.media)
                    hasMedia.push(value);
            }
            this.showObjects(hasMedia);
        })

        //range by time
        $("#check1").on("click", () => {
            this.resetCheckboxes(1);
            this.filter = 'time';
            this.index = 1;
            this.filterData();
        })

        //range by retweet
        $("#check4").on("click", () => {
            this.resetCheckboxes(4);
            this.filter = 'retweet_count';
            this.filterData();
        })
    }
    //function for reseting all checkboxes
    resetCheckboxes(index) {
        for(var i = 0; i < 5; i++) {
            if( i !== index)
                $('#check'+i).prop('checked', false);
        }

    }

    createXLS(){
        console.log('tjoloahoopopp');
        var json = {
            foo: 'bar',
            qux: 'moo',
            poo: 123,
            stux: new Date()
        }

        var xls = json2xls(json);
        //fs.writeFileSync('data.xlsx', xls, 'binary');
        /*fs.writeFile("data.xlsx'", xls, function(err) {
          console.error(err);
      });*/
    }

    //remove all previews
    removeTweets(){
        let n = document.getElementsByClassName("twitter-tweet").length;
        for(var i = 0; i < n; i++)
            document.getElementsByClassName("twitter-tweet")[0].remove()
    }

    //show a single object
    showObject(data){
        this.removeTweets();
        TwitterWidgetsLoader.load(function(twttr) {
            twttr.widgets.createTweet(data.id, document.getElementsByClassName('the-tweets')[0]);
        });
    }

    //show array of objects
    showObjects(data){
        this.removeTweets();
        this.data = data;
        for( let value of data){
            TwitterWidgetsLoader.load(function(twttr) {
                twttr.widgets.createTweet(value.id, document.getElementsByClassName('the-tweets')[0]);
            });
        }
    }

    filterData(){
        var sortedData = _.sortBy(this.data, this.filter);
        this.showObjects(sortedData)
    }

    resetFilters(){
        for(var i = 0; i < this.filterTypes.length; i++)
            $('#check'+i).prop('checked', false);
    }
} export default TwitterPreview;
