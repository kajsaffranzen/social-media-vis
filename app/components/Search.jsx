import React from 'react';
import ReactDOM from 'react-dom';

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
  
  geocodeAddress(address){
    //TODO: implement error-message if lat and lng isn't found
    let latitude, longitude;
    this.geocoder.geocode({'address': address}, function handleResults(results, status){
      if(status === google.maps.GeocoderStatus.OK) {
        latitude = results[0].geometry.location.lat();
        longitude = results[0].geometry.location.lng();
      }
    });

    this.setState({
      lat: latitude,
      lng: longitude
    });
    console.log('lat: ' + this.state.lat);
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
    return(
      <form onSubmit={this.handleSubmit}>
        <input className="default-inpu" placeholder="Enter your name" {...this.props} type="text" onChange={this.handleChange} />
        <input type="submit" value="Sök" />
      </form>
   )
  }
}

ReactDOM.render(<Search/>, document.getElementById('hello'));
