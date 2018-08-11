import $ from 'jquery';
import _ from 'underscore';

import { showObjects, showErrorMessage, removeTweets } from './components/TwitterPreview'
import { splitDataBetweenGeoOrNot } from './data/utils.js';

let activeFilter = 10;

class Filters {
  constructor() {
    this.withoutGeo = null;
    $('#check0').on('click', () => {
      let filter = $('#check0').data('key');
      this.updateFilters(0, filter);
    })

    $('#check1').on('click', () => {
      let filter = $('#check1').data('key');
      this.updateFilters(1, filter);
    })

    $('#check2').on('click', () => {
      let filter = $('#check2').data('key');
      this.updateFilters(2, filter);
    })

    $('#check3').on('click', () => {
      const filter = $('#check3').data('key');
      this.updateFilters(3, filter);
    })

    $('#check4').on('click', () => {
      let filter = $('#check4').data('key');
      this.updateFilters(4, filter);
    })
  }

  // Update filter logic
  updateFilters(id, filter) {
    activeFilter = id;
    const item = $('#check'+id);

    if (item.prop('checked') === true) {
      this.resetCheckboxes(id);
      if (filter === 'media') {
        if (!this.isBrushed) {
          this.filterByMedia(this.allTweets);
        } else {
          this.filterByMedia(this.brushedData);
        }
      } else if(filter === 'time' || filter === 'retweets') {
        if (!this.isBrushed) {
          this.filterData(filter, this.allTweets);
        } else {
          this.filterData(filter, this.brushedData);
        }
      } else if (filter === 'no-geo') {
        showObjects(this.withoutGeo);
      } else {
        showObjects(this.allTweets)
      }
    } else {
      activeFilter = 10;
      showErrorMessage(false);
      removeTweets();
      /*if (this.isBrushed) {
        this.showObjects(this.brushedData);
      } */
    }
  }

  // Function for reseting all checkboxes
  resetCheckboxes(index) {
    for (let i = 0; i < 5; i++) {
      if ( i !== index) {
        $('#check'+i).prop('checked', false);
      }
    }
  }

  // Filter time and retweets
  filterData(filter, data) {
    const sortedData = _.sortBy(data, filter);
    showObjects(sortedData)
  }

  filterByMedia(data) {
    let hasMedia = [];
    if (!data) return showErrorMessage(true);
    if (data && data.length) {
      for (let value of data) {
        if (value.entities.media) {
          hasMedia.push(value);
        }
      }
      return hasMedia.length > 1 ? showObjects(hasMedia) : showObject(hasMedia);
    }

    if (data.entities.media) {
      showObject(data, false)
    }
  }

  setNewData(data) {
    this.allTweets = data;
    const dividedData = splitDataBetweenGeoOrNot(data);
    this.withGeo = dividedData[0];
    this.withoutGeo = dividedData[1];
    console.log(this.allTweets.length);
  }

} export default Filters;
