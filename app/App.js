import Map from './components/Mapbox'
import Search from './components/SearchComponent';
import D3Scatter from './components/D3Components/D3Scatter'
import { getDefaultTwitterData } from './data/TwitterData'
import {createLngLat} from './data/utils.js';

class Appen {
  constructor() {
    this.mapComponent = new Map();
    this.map = this.mapComponent.init();

    this.scatterComponent = new D3Scatter(this.map);
    this.svg = this.scatterComponent.initSVG();
    this.scatterComponent.init(this.svg);

    this.search = new Search();
    this.searchButton(this.mapComponent);
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
    }
    getCoords();
  }

  async getData(res) {
    var result = await getDefaultTwitterData(res);
    this.addSearchData(result)
  }

  addSearchData(data) {
    this.allData = data;
    let totalTweets = [];
    Array.prototype.push.apply(totalTweets,data);
    console.log('totalTweets: ', totalTweets.length);
    const geoData = createLngLat(data);
    this.scatterComponent.drawCircles(geoData);
  }

} export default Appen;
