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

}

export default SearchComponent;
