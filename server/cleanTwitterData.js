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
    fs.writeFile("test1.json", obj, function(err) {
      console.error(err);
  });
  },
  cleanData(data){
      var jsonObj = [];
      return new p.Promise(function(resolve){
          for(var i = 0; i < data.length; i++){
              for(var j = 0; j <data[i].length; j++){
                  var lat = 0;
                  var lng = 0;
                  if(data[i][j].coordinates != null){
                      lat = data[i][j].coordinates.coordinates[1];
                      lng = data[i][j].coordinates.coordinates[0];
                  }
                 var newObject = {
                     lat: lat,
                     lng: lng,
                      id: data[i][j].id_str,
                      time: data[i][j].created_at,
                      text: data[i][j].text,
                      retweet_count: data[i][j].retweet_count,
                      name: data[i][j].user.name
                 };
                 jsonObj.push(newObject);
              }
          }
          /*var json = JSON.stringify(jsonObj);
          self.saveToFile(json);*/
          //console.log(jsonObj);
          resolve(jsonObj);
      });
  },
}
