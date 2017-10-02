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
        this.filter = 'random';
        this.data = 0;
        this.index = 3;
        this.init();
    }
    init(){
        var exp_button = document.getElementById('export-btn');
        exp_button.addEventListener('click', () => {
            this.createXLS();
        }, false );

        $("#check0").on("click", () => {
            $('#check2').prop('checked', false);
            $('#check1').prop('checked', false);
            this.filter = 'random';
            this.index = 0;
            var shuffle = _.shuffle(this.data);
            this.showObjects(shuffle);
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
            this.filter = 'noneGeo';
            this.index = 2;
            //this.showObjects(shuffle);
        })
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
