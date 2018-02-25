/*
Creates and shows a simple preview for tweets from the chosen area
The shown tweets are based on what kind of filter the user wants
*/

import TwitterWidgetsLoader from 'twitter-widgets';
import _ from 'underscore';
import $ from 'jquery';


class TwitterPreview {
    constructor(){
        this.allTweets = null;
        this.noneGeoTweets = null;
        this.activeFilter = 10;
        this.isBrushed = false;
        this.brushedData = null;
        this.isShowingTweets = false;
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
          this.showObjects(this.allTweets);
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
    filter_by_media(data, keep) {
      let hasMedia = [];

      // check if the data has a media object and then show it
      if (data.length) {
        for (let value of data) {
            if (value.entities.media) {
              hasMedia.push(value);
            }
        }

        if (hasMedia === 1) {
          this.showObjects(hasMedia)
        } else if (hasMedia.length > 1) {
          this.showObjects(hasMedia)
        } else {
          this.show_error_message(true)
        }

      } else {
        if (data.entities.media) {
          this.showObject(data, this.isShowingTweets)
        }
      }
    }

    // Filter time and retweets
    filterData(filter, data) {
        var sortedData = _.sortBy(data, filter);
        this.showObjects(sortedData)
    }

    // Function for reseting all checkboxes
    resetCheckboxes(index) {
      for(var i = 0; i < 5; i++) {
        if( i !== index) {
          $('#check'+i).prop('checked', false);
        }
      }
    }

    // Update stream data
    update_data(all, noGeo) {
      this.allTweets = all;
      this.noneGeoTweets = noGeo;

      // see if data is supposed to be shown
      if(this.activeFilter < 10) {
        let filter = $('#check'+ this.activeFilter).data('key');
        if(filter === 'media') {
          let lastIndex = this.allTweets.length-1;
          let lastObject = [this.allTweets[lastIndex]];
          this.filter_by_media(this.allTweets[lastIndex])
        } else if (filter === 'no-geo') {
          let lastIndex = this.noneGeoTweets.length-1;
          this.showObject(this.noneGeoTweets[lastIndex], this.isShowingTweets);
        } else if(filter === '') {
          let lastIndex = this.allTweets.length-1;
          this.showObject(this.allTweets[lastIndex], this.isShowingTweets);
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
        //som är i bounds
      } 
    }

    // Check if a filter is active
    active_filter() {
      if(this.activeFilter >= 10) {
        this.removeTweets();
        return false;
      } else {
        let filterType = $('#check' + this.activeFilter).data('key');
        console.log('filterType ', filterType);
        if(filterType === 'media') {
          this.filter_by_media(this.allTweets);
        } else if(filterType === 'time') {
          this.filterData(filterType, this.allTweets);
        } else if(filterType === 'no-geo') {
          this.showObjects(this.noneGeoTweets);
        } else {
          this.showObjects(this.allTweets);
        }
      }
    }

    // for a completely new brush
    update_brush_status(data) {
      if(data) {
        this.isBrushed = true;
        this.brushedData = data;
        this.show_brushed_data(data);
      } else {
        this.isBrushed = false;
        this.brushedData = null;
        this.active_filter();
      }
    }

    // Show brushed data
    show_brushed_data(data) {
      this.removeTweets();

      if(this.activeFilter >= 10) {
          this.showObjects(data);
      } else {
        let filter = $('#check'+ this.activeFilter).data('key');
        if(filter === 'media') {
          this.filter_by_media(data);
        } else if(filter === 'time' || filter === 'retweets') {
          this.filterData(filter, data);
        } else if(filter === 'no-geo') {
          this.showObjects(this.noneGeoTweets);
        } else {
          this.showObjects(this.allTweets);
        }
      }
    }

    // Show a single object
    showObject(data, keep) {
      if(!keep) {
        this.removeTweets();
      }
      this.show_error_message();

      TwitterWidgetsLoader.load(function(twttr) {
        twttr.widgets.createTweet(data.id,
          document.getElementsByClassName('the-tweets')[0]);
      });
      this.isShowingTweets = true;
    }

    // Show array of objects
    showObjects(data){
        this.removeTweets();
        this.show_error_message();

        for(let value of data){
            TwitterWidgetsLoader.load(function(twttr) {
                twttr.widgets.createTweet(value.id, document.getElementsByClassName('the-tweets')[0]);
            });
        }
        this.isShowingTweets = true;
    }

    // Remove all previews
    removeTweets() {
        let n = document.getElementsByClassName('twitter-tweet').length;
        for(var i = 0; i < n; i++) {
          document.getElementsByClassName('twitter-tweet')[0].remove()
        }
        this.isShowingTweets = false;
    }

    // Show error message
    show_error_message(show) {
      let feedback = document.getElementsByClassName('test')[0];

      if(show) {
        this.removeTweets();
        feedback.style.display = 'block';
      } else {
        feedback.style.display = 'none';
      }

    }

    resetFilters(){
        for(var i = 0; i < this.filterTypes.length; i++) {
          $('#check'+i).prop('checked', false);
        }
    }

} export default TwitterPreview;
