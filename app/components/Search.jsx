import React from 'react';
import ReactDOM from 'react-dom';
import Geosuggest from 'react-geosuggest';
import actions from '../actions/SearchAction.js';
import AppContainer from '../AppContainer.js'

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      city: '',
      lat: '',
      lng: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getData(){
    actions.getData(this.state);
  }

  geocodeAddress(address){
    //TODO: implement error-message if lat and lng isn't found
    let latitude, longitude;
    this.geocoder.geocode({'address': address}, function handleResults(results, status){
      if(status === google.maps.GeocoderStatus.OK) {
        this.setState({
          city: results[0].formatted_address,
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
      }
      this.getData();
    }.bind(this));

  }

  handleChange(e){
    this.setState({
      city: e.target.value
    });
  }

  handleSubmit(e){
    e.preventDefault();
    var address = this.state.city;
    this.geocodeAddress(address);
  }

  componentDidMount(){
    this.geocoder = new google.maps.Geocoder();
  }

  render(){
    var fixtures = [
      {label: 'Old Elbe Tunnel, Hamburg', location: {lat: 53.5459, lng: 9.966576}},
      {label: 'Reeperbahn, Hamburg', location: {lat: 53.5495629, lng: 9.9625838}},
      {label: 'Alster, Hamburg', location: {lat: 53.5610398, lng: 10.0259135}}
    ];
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <input className="default-inpu" placeholder="Enter your name" {...this.props} type="text" onChange={this.handleChange} />
          <input type="submit" value="Sök" />
        </form>
      </div>
  );
  }
}
export default Search;
