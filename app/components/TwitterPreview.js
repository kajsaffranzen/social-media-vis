/*
Creates and shows a simple preview for tweets from the chosen area
The shown tweets are based on what kind of filter the user wants
*/

import TwitterWidgetsLoader from 'twitter-widgets';
import _ from 'underscore';
import $ from 'jquery';

// Show awway of objects
export function showObjects(objects) {
  removeTweets();

  if (!objects || objects.length === 0 ) {
    showErrorMessage(true);
  } else {
    showErrorMessage();
    for (let value of objects){
      TwitterWidgetsLoader.load((twttr) => {
          twttr.widgets.createTweet(value.id, document.getElementsByClassName('the-tweets')[0]);
      });
    }
    // this.isShowingTweets = true;
  }
}

// Show a single object
export function showObject(data, keep) {
  if(!keep) {
    removeTweets();
  }
  showErrorMessage();

  TwitterWidgetsLoader.load( (twttr) => {
    twttr.widgets.createTweet(data.id,
      document.getElementsByClassName('the-tweets')[0]);
  });
  //this.isShowingTweets = true;
}

// Show error message
export function showErrorMessage(show) {
  const feedback = document.getElementsByClassName('test')[0];

  if(show) {
    //  this.removeTweets();
    feedback.style.display = 'block';
  } else {
    feedback.style.display = 'none';
  }
}

// Remove all previews
export function removeTweets() {
  const size = document.getElementsByClassName('twitter-tweet').length;
  const objects = document.getElementsByClassName('twitter-tweet');
  for (let i = 0; i < size; i++) {
    document.getElementsByClassName('twitter-tweet')[0].remove();
  }
  // this.isShowingTweets = false;
}

// TODO: add loading widget for showing tweets


class TwitterPreview {
    constructor(){
        this.allTweets = null;
        this.noneGeoTweets = null;
        this.activeFilter = 10;
        this.isBrushed = false;
        this.brushedData = null;
        this.isShowingTweets = false;
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

    resetFilters(){
        for(var i = 0; i < this.filterTypes.length; i++) {
          $('#check'+i).prop('checked', false);
        }
    }

} export default TwitterPreview;
