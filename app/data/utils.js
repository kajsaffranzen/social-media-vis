import mapbox from 'mapbox-gl';

export function createLngLat(data) {
  let newData = [];
  for (let value of data) {
    if (value.coords !== null) {
      value.LngLat = new mapbox.LngLat(value.coords.coordinates[0],
        value.coords.coordinates[1]);
      newData.push(value);
    } else if (value.geo !== null){
      value.LngLat = new mapbox.LngLat(value.coords.coordinates[1],
        value.coords.coordinates[0]);
      newData.push(value);
    }
  }
  return newData;
}

export function splitDataBetweenGeoOrNot(data) {
  let hasGeoData = [];
  let noGeoData = [];
  for (let value of data) {
    if (value.coords !== null || value.geo !== null) {
      hasGeoData.push(value);
    } else {
      noGeoData.push(value);
    }
  }

  return [hasGeoData, noGeoData];
}
