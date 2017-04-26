var fs = require('fs');
var p = require('es6-promise');

var self = module.exports = {
  createObject(){
    var t = '[{"lng": "0", "lat": "0", "count": "0"}]';

    var obj = JSON.parse(t);
    return obj;
  },
  saveToFile(obj){
      //fs.writeFile('test.json', obj, 'utf8', callback);
    fs.writeFile("test.json", obj, function(err) {
      console.error(err);
  });
  },
  getRightParameters(data){
      var jsonObj = [];
      console.log('i getRightParameters');
      return new p.Promise(function(resolve){
          for(var i=0; i<20; i++){
              console.log(data.statuses[i]);
                if(!data.statuses[i]){
                  console.log(data.statuses[i]);
                }
                else {
                  if(data.statuses[i].coordinates != null){
                    var newObject = {
                        lat: data.statuses[i].coordinates.coordinates[1],
                        lng: data.statuses[i].coordinates.coordinates[0],
                        time: data.statuses[i].created_at,
                        id: data.statuses[i].id_str,
                        tweet: data.statuses[i].text
                       };
                    jsonObj.push(newObject);

                }else if(!data.statuses[i].coordinates && data.statuses[i].place)
                  console.log('i else: ' +data.statuses[i].place);
            }
        }
        console.log(jsonObj);
        resolve(jsonObj);
      })

    //var json = JSON.stringify(jsonObj);
    //self.saveToFile(json);
    }
}



/*{ id: 'd56c5babcffde8ef',
  url: 'https://api.twitter.com/1.1/geo/id/d56c5babcffde8ef.json',
  place_type: 'city',
  name: 'Stockholm',
  full_name: 'Stockholm, Sweden',
  country_code: 'SE',
  country: 'Sweden',
  contained_within: [],
  bounding_box: { type: 'Polygon', coordinates: [ [Object] ] },
  attributes: {} }*/

/*bounding_box for Stockholm
  17.7601322, 59.2271383 ],
      [ 18.1999856, 59.2271383 ],
      [ 18.1999856, 59.4402037 ],
      [ 17.7601322, 59.4402037 */
