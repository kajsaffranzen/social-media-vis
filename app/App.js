import Map from './components/Mapbox'
import Search from './components/SearchComponent';
import D3Scatter from './components/D3Components/D3Scatter'
import dataSizeComponent from './components/dataSizeComponent'
import { getDefaultTwitterData, getNextDataIteration } from './data/TwitterData'
import { createLngLat, splitDataBetweenGeoOrNot } from './data/utils.js';
import Filters from './Filters';

this.totalTweets = [];

class Appen {
  constructor() {
    // add map
    this.mapComponent = new Map();
    this.map = this.mapComponent.init();

    // add scatter
    this.scatterComponent = new D3Scatter(this.map);
    this.svg = this.scatterComponent.initSVG();
    this.scatterComponent.init(this.svg);

    // add search functionality
    this.search = new Search();
    this.searchButton(this.mapComponent);

    // show number of fetched tweets
    this.dataSize = new dataSizeComponent(this.svg)

    // set filterTypes
    this.filters = new Filters();

    // variables
    this.totalTweets = [];

  }

  searchButton(mapComponent) {
    const startBtn = document.getElementById('get-data-btn');
    startBtn.addEventListener('click', () => {
        this.newSearch(mapComponent);
    }, false );
  }

  newSearch(map) {
    const getCoords = async () => {
      const res = await this.search.getCoordinates();
      const mapCoordinates = [res.lng, res.lat];
      this.mapComponent.centerMap(mapCoordinates);
      this.getData(res)
    };
    getCoords();
  }

  async getData(res) {
    let result = await getDefaultTwitterData(res);
    this.addSearchData(result.data);
    console.log(result)

    // get new datachunks
    if (result.max_id) {
       this.nextRequest(result);
    }
  }

  async nextRequest(result) {
    console.log(result.max_id)
    let nextResult = await getNextDataIteration(result.max_id);
    console.log(nextResult);
    this.addNextData(nextResult.data);
  };

  addNextData(data) {
    // merge new data with old data
    console.log('i nextData ', data.length);
    Array.prototype.push.apply(this.totalTweets, data);

    // split and update Numbers
    const dividedData = splitDataBetweenGeoOrNot(data);
    const geoData = createLngLat(dividedData[0]);
    this.scatterComponent.drawCircles(geoData);
    this.dataSize.updateNumbers(this.totalTweets.length, dividedData[0].length);

    // update filter things
    this.filters.setNewData(data);
  }

  addSearchData(data) {
    this.allData = data;

    // let totalTweets = [];
    Array.prototype.push.apply(this.totalTweets, data);
    console.log('totalTweets: ', this.totalTweets.length);

    const dividedData = splitDataBetweenGeoOrNot(data);
    const geoData = createLngLat(dividedData[0]);
    this.scatterComponent.drawCircles(geoData);
    this.dataSize.updateNumbers(data.length, dividedData[0].length);

    // update filter things
    this.filters.setNewData(data);
  }

} export default Appen;
