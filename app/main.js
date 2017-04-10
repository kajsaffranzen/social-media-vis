import Map from './components/Map';
import Search from './components/Search.jsx';
import SearchStore from './SearchStore';
import MapB from './Mapbox'
var d3 = require('d3')

let kajsa = new MapB();

/*let kajsa = new Map();
console.log(kajsa.hello());*/

function getStore() {
  return [
    SearchStore,
  ];
}
