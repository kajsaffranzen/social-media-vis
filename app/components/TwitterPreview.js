/*
Creates and shows a simple preview for tweets from the chosen area
The shown tweets are based on what kind of filter the user wants
*/

import TwitterWidgetsLoader from 'twitter-widgets'
import _ from 'underscore';
import $ from 'jquery';
//import json2xls from 'json2xls';
var fs = require('fs');

class TwitterPreview {
    constructor(){
        this.filter = '';
        this.data = 0;
        this.index = 3;
        this.init();
    }

    init() {
      this.setFilters();
    }

    setFilters() {
      $('#check0').on('click', () => {
        let filter = $('#check0').data('key');
        this.update_filters(0, filter);
      })

      $('#check1').on('click', () => {
        let filter = $('#check1').data('key');
        this.update_filters(1, filter);
      })

      $('#check2').on('click', () => {
        let filter = $('#check2').data('key');
        this.update_filters(2, filter);
      })

      $('#check3').on('click', () => {
        let filter = $('#check3').data('key');
        this.update_filters(3, filter);
      })

      $('#check4').on('click', () => {
        let filter = $('#check4').data('key');
        this.update_filters(4, filter);
      })
    }

    // Update filter logic
    update_filters(id, filter) {
      this.activeFilter = id;
      let item = $('#check'+id);
      if(item.prop('checked') === true) {
        this.resetCheckboxes(id);
        if(filter === 'media') {
          if(!this.isBrushed) {
            this.filter_by_media(this.allTweets);
          } else {
            this.filter_by_media(this.brushedData);
          }
        } else if(filter === 'time' || filter === 'retweets') {
          if(!this.isBrushed) {
            this.filterData(filter, this.allTweets);
          } else {
            this.filterData(filter, this.brushedData);
          }
        } else if(filter === 'no-geo') {
          this.showObjects(this.noneGeoTweets);
        } else {
          if (this.allTweets.length > 1) {
            this.showObjects(this.allTweets);
          } else {
            this.showObject(this.allTweets[0]);
          }

        }
      } else {
        this.activeFilter = 10;
        this.show_error_message(false);
        this.removeTweets();
        if(this.isBrushed) {
          this.showObjects(this.brushedData);
        }
      }
    }

    // filter by media
    /*filter_by_media(data, keep) {
      let hasMedia = [];

      // check if the data has a media object and then show it
      if (data.length) {
        for (let value of data) {
          if (value.entities.media) {
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
    } */

    //function for reseting all checkboxes
    resetCheckboxes(index) {
      for (var i = 0; i < 5; i++) {
        if ( i !== index) {
          $('#check'+i).prop('checked', false);
        }
      }
    }
    /*
    * If an area is already brushed and a item from the stream API
    * is within the selected bounds
    */
    add_single_data_object(object) {
      // kolla om det är något filter på och om det passar
      if(this.activeFilter < 10) {
        console.log('a filter is active');
        this.active_filter_item();
      } else {
        console.log('show the data');
        this.showObject(object, this.isShowingTweets);
      }

      //lägg till objektet i listan som visas
    }

    active_filter_item(object) {
      let filterType = $('#check' + this.activeFilter).data('key');
      if(filterType === 'media') {
        this.filter_by_media(object);
      } else if(filterType === 'time') {
        // todo: behöver på något vis få tag på alla som är i brushed,
        //även nya, måste allså uppdatera isBrushedData när ny kommer in
        //som är i boun
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

      //  var xls = json2xls(json);
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
