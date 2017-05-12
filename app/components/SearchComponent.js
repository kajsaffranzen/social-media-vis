import p from 'es6-promise';

class SearchComponent {
    constructor(){
        this.input = '';
        this.geocoder = new google.maps.Geocoder();
    }
    getCoordinates(){
        this.input = document.getElementById('searchInput').value;

        return new p.Promise( (res, rej) => {
            this.geocoder.geocode({'address': this.input}, function(results, status) {
                if (status === 'OK'){
                    let obj = {
                        city: results[0].formatted_address,
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    }
                    res(obj);
                }
            })
        })
    }
    getAddress(coord){
        var latlng = {lat: parseFloat(coord[0]), lng: parseFloat(coord[1])};
        return new p.Promise( (res, rej) => {
            this.geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === 'OK'){
                    var send = results[0].formatted_address.split(',');
                    res(send[0]);
                }
            })
        })
    }

}

export default SearchComponent;
